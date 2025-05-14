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
      const {
        cuisineDetails = [],
        restaurantImages = [],
        ...restaurantData
      } = formData;

      // Step 1: Create the restaurant without images
      const restaurantResponse = await createRestaurant({
        ...restaurantData,
        cuisineDetails: cuisineDetails.map(cuisine => ({
          name: cuisine.name, price: cuisine.price
          // Don't include image here
        }))
      });

      const restaurantId = restaurantResponse.data._id;

      // Step 2: Upload cuisine images if any
      const cuisineUploadPromises = cuisineDetails.map(async (cuisine, index) => {
        if (cuisine.image instanceof File) {
          // This is the File object
          const cuisineId = restaurantResponse.data.cuisineDetails[index]._id;
          return uploadCuisineImage(restaurantId, cuisineId, cuisine.image); // The File object);
        }
        return Promise.resolve();
      });

      await Promise.all(cuisineUploadPromises);

      // Step 3: Upload restaurant images if any
      if (restaurantImages.length > 0) {
        await uploadRestaurantImages(restaurantId, restaurantImages.map(img => img.file));
      }

      // Return the complete restaurant data
      return restaurantResponse;
    },
    onMutate: async newRestaurant => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({queryKey: restaurantKeys.lists()});
      await queryClient.cancelQueries({
        queryKey: restaurantKeys.byService(newRestaurant.service)
      });

      // Snapshot previous values
      const previousRestaurants = queryClient.getQueryData(restaurantKeys.lists());
      const previousServiceRestaurants = queryClient.getQueryData(restaurantKeys.byService(newRestaurant.service));

      // Optimistically update both general and service-specific restaurant lists
      const optimisticRestaurant = {
        ...newRestaurant,
        _id: `optimistic-${Date.now()}`,
        createdAt: new Date().toISOString(),
        isOptimistic: true
      };

      // Update general restaurants list
      queryClient.setQueryData(
        restaurantKeys.lists(), old => old
        ? [
          ...old,
          optimisticRestaurant
        ]
        : [optimisticRestaurant]);

      // Update service-specific restaurants list
      queryClient.setQueryData(restaurantKeys.byService(newRestaurant.service), old => (
        old
        ? [
          ...old,
          optimisticRestaurant
        ]
        : [optimisticRestaurant]));

      return {previousRestaurants, previousServiceRestaurants};
    },
    onSuccess: (data, variables) => {
      // Replace optimistic data with actual data in both caches
      const updateCache = key => {
        queryClient.setQueryData(
          key, old => old
          ?.map(
            item => item.isOptimistic
            ? {
              ...data.data,
              _id: data.data._id
            }
            : item) || [data.data]);
      };

      updateCache(restaurantKeys.lists());
      updateCache(restaurantKeys.byService(variables.service));

      // Invalidate related queries to ensure fresh data
      queryClient.invalidateQueries({queryKey: restaurantKeys.all});
      queryClient.invalidateQueries({
        queryKey: ["services", variables.service]
      });
    },
    onError: (error, variables, context) => {
      // Rollback both caches on error
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
      // Final cleanup for both caches
      queryClient.invalidateQueries({queryKey: restaurantKeys.lists()});
      queryClient.invalidateQueries({
        queryKey: restaurantKeys.byService(variables.service)
      });
    }
  });
};