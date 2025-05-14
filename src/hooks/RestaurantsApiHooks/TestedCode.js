import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createRestaurant, uploadCuisineImage, uploadRestaurantImages} from "../../services/restaurants.api";

export const restaurantKeys = {
  all: ["restaurants"],
  lists: () => [
    ...restaurantKeys.all,
    "list"
  ],
  details: () => [
    ...restaurantKeys.all,
    "detail"
  ],
  byService: serviceId => [
    ...restaurantKeys.all,
    "byService",
    serviceId
  ],
  byHost: hostId => [
    ...restaurantKeys.all,
    "byHost",
    hostId
  ]
};

export const useCreateRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async formData => {
      try {
        const {
          cuisineDetails = [],
          restaurantImages = [],
          ...restaurantData
        } = formData;

        // Step 1: Check for existing restaurants for this service
        const existingRestaurants = await queryClient.getQueryData(restaurantKeys.byService(restaurantData.service));
        if (
          existingRestaurants
          ?.length > 0) {
          throw new Error("A restaurant already exists for this service location");
        }

        // Step 2: Create the restaurant without images
        const restaurantResponse = await createRestaurant({
          ...restaurantData,
          cuisineDetails: cuisineDetails.map(cuisine => ({name: cuisine.name, price: cuisine.price}))
        });

        const restaurantId = restaurantResponse.data._id;

        // Step 3: Upload cuisine images if any
        const cuisineUploadPromises = cuisineDetails.map(async (cuisine, index) => {
          if (cuisine.image instanceof File) {
            const cuisineId = restaurantResponse.data.cuisineDetails[index]._id;
            return uploadCuisineImage(restaurantId, cuisineId, cuisine.image);
          }
          return Promise.resolve();
        });

        await Promise.all(cuisineUploadPromises);

        // Step 4: Upload restaurant images if any
        if (restaurantImages.length > 0) {
          await uploadRestaurantImages(restaurantId, restaurantImages.map(img => img.file));
        }

        return restaurantResponse;
      } catch (error) {
        // Enhance error message for duplicate restaurants
        if (error.message.includes("already exists at this location") || error.message.includes("already exists for this service")) {
          throw new Error("A restaurant already exists at this location. Please choose a different location.");
        }
        throw error;
      }
    },
    onMutate: async newRestaurant => {
      await queryClient.cancelQueries(restaurantKeys.lists());
      await queryClient.cancelQueries(restaurantKeys.byService(newRestaurant.service));

      const previousRestaurants = queryClient.getQueryData(restaurantKeys.lists());
      const previousServiceRestaurants = queryClient.getQueryData(restaurantKeys.byService(newRestaurant.service));

      const optimisticRestaurant = {
        ...newRestaurant,
        _id: `optimistic-${Date.now()}`,
        createdAt: new Date().toISOString(),
        isOptimistic: true
      };

      queryClient.setQueryData(restaurantKeys.lists(), (old = []) => [
        ...old,
        optimisticRestaurant
      ]);
      queryClient.setQueryData(restaurantKeys.byService(newRestaurant.service), (old = []) => [
        ...old,
        optimisticRestaurant
      ]);

      return {previousRestaurants, previousServiceRestaurants};
    },
    onSuccess: (data, variables) => {
      const updateCache = key => {
        queryClient.setQueryData(key, (old = []) => old.map(
          item => item.isOptimistic
          ? {
            ...data.data,
            _id: data.data._id
          }
          : item));
      };

      updateCache(restaurantKeys.lists());
      updateCache(restaurantKeys.byService(variables.service));
    },
    onError: (error, variables, context) => {
      if (
        context
        ?.previousRestaurants) {
        queryClient.setQueryData(restaurantKeys.lists(), context.previousRestaurants);
      }
      if (
        context
        ?.previousServiceRestaurants) {
        queryClient.setQueryData(restaurantKeys.byService(variables.service), context.previousServiceRestaurants);
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries(restaurantKeys.lists());
      queryClient.invalidateQueries(restaurantKeys.byService(variables.service));
    }
  });
};