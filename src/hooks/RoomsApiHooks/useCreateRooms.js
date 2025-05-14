import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createRoom, uploadRoomImages, uploadAccommodationImages} from "../../services/room.api";

export const roomKeys = {
  all: ["rooms"],
  lists: () => [
    ...roomKeys.all,
    "list"
  ],
  details: () => [
    ...roomKeys.all,
    "detail"
  ],
  byService: serviceId => [
    ...roomKeys.all,
    "byService",
    serviceId
  ],
  byHost: hostId => [
    ...roomKeys.all,
    "byHost",
    hostId
  ]
};

export const useCreateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async formData => {
      const {
        roomImages = [],
        propertyImages = [],
        ...roomData
      } = formData;

      try {
        // Step 1: Create the room first
        const roomResponse = await createRoom(roomData);
        const roomId = roomResponse.data._id;

        // Step 2: Upload images in parallel if they exist
        const uploadPromises = [];

        if (roomImages.length > 0) {
          const imageFiles = roomImages.map(img => img.file);
          await uploadRoomImages(roomId, imageFiles).catch(e => {
            console.error("Room image upload failed:", e);
          });
        }

        if (propertyImages.length > 0) {
          const propertyImageFiles = propertyImages.map(img => img.file);
          await uploadAccommodationImages(roomId, propertyImageFiles).catch(e => {
            console.error("Property image upload failed:", e);
          });
        }

        // Wait for all uploads to complete
        await Promise.all(uploadPromises);

        // Step 3: Return the complete room data
        return roomResponse;
      } catch (error) {
        console.error("Room creation or image upload failed:", error);
        throw error;
      }
    },
    onMutate: async newRoom => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({queryKey: roomKeys.lists()});

      // Cancel service-specific queries if service ID exists
      if (newRoom.service) {
        await queryClient.cancelQueries({
          queryKey: roomKeys.byService(newRoom.service)
        });
      }

      // Cancel host-specific queries if host ID exists
      if (newRoom.host) {
        await queryClient.cancelQueries({
          queryKey: roomKeys.byHost(newRoom.host)
        });
      }

      // Snapshot previous values
      const previousRooms = queryClient.getQueryData(roomKeys.lists());
      const previousServiceRooms = newRoom.service
        ? queryClient.getQueryData(roomKeys.byService(newRoom.service))
        : null;
      const previousHostRooms = newRoom.host
        ? queryClient.getQueryData(roomKeys.byHost(newRoom.host))
        : null;

      // Create optimistic room data
      const optimisticRoom = {
        ...newRoom,
        _id: `optimistic-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isOptimistic: true
      };

      // Update general rooms list
      queryClient.setQueryData(
        roomKeys.lists(), old => old
        ? [
          ...old,
          optimisticRoom
        ]
        : [optimisticRoom]);

      // Update service-specific rooms list if service ID exists
      if (newRoom.service) {
        queryClient.setQueryData(
          roomKeys.byService(newRoom.service), old => old
          ? [
            ...old,
            optimisticRoom
          ]
          : [optimisticRoom]);
      }

      // Update host-specific rooms list if host ID exists
      if (newRoom.host) {
        queryClient.setQueryData(
          roomKeys.byHost(newRoom.host), old => old
          ? [
            ...old,
            optimisticRoom
          ]
          : [optimisticRoom]);
      }

      return {previousRooms, previousServiceRooms, previousHostRooms};
    },
    onSuccess: (data, variables) => {
      // Replace optimistic data with actual data in all relevant caches
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

      updateCache(roomKeys.lists());

      if (variables.service) {
        updateCache(roomKeys.byService(variables.service));
      }

      if (variables.host) {
        updateCache(roomKeys.byHost(variables.host));
      }

      // Invalidate related queries to ensure fresh data
      queryClient.invalidateQueries({queryKey: roomKeys.all});

      if (variables.service) {
        queryClient.invalidateQueries({
          queryKey: ["services", variables.service]
        });
      }
    },
    onError: (error, variables, context) => {
      // Rollback all caches on error
      if (
        context
        ?.previousRooms) {
        queryClient.setQueryData(roomKeys.lists(), context.previousRooms);
      }

      if (
        variables.service && context
        ?.previousServiceRooms) {
        queryClient.setQueryData(roomKeys.byService(variables.service), context.previousServiceRooms);
      }

      if (
        variables.host && context
        ?.previousHostRooms) {
        queryClient.setQueryData(roomKeys.byHost(variables.host), context.previousHostRooms);
      }
    },
    onSettled: (data, error, variables) => {
      // Final cleanup for all caches
      queryClient.invalidateQueries({queryKey: roomKeys.lists()});

      if (variables.service) {
        queryClient.invalidateQueries({
          queryKey: roomKeys.byService(variables.service)
        });
      }

      if (variables.host) {
        queryClient.invalidateQueries({
          queryKey: roomKeys.byHost(variables.host)
        });
      }
    }
  });
};