import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  fetchAllRooms,
  selectRooms,
  selectRoomsLoading,
  selectRoomsError,
  selectRoomsStatus,
  selectLastFetched,
  clearError,
} from "../../../stores/Slices/roomSlice";
import {
  fetchAllServiceNames,
  selectAllServiceNames,
} from "../../../stores/Slices/serviceSlice";
import {
  Button,
  ErrorMessage,
  LoadingSpinner,
} from "../../../components/Ui/index";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import RoomsLandingCard from "../../../components/Landing/Rooms/RoomsLandingCard";

const RoomsLandingProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { serviceId } = useParams();

  // Select data from Redux store
  const rooms = useSelector(selectRooms);
  const loading = useSelector(selectRoomsLoading);
  const error = useSelector(selectRoomsError);
  const status = useSelector(selectRoomsStatus);
  const lastFetched = useSelector(selectLastFetched);
  const allServiceNames = useSelector(selectAllServiceNames);

  // Fetch rooms and service names when component mounts or serviceId changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Always fetch when serviceId changes or component mounts
        await dispatch(fetchAllRooms({ service: serviceId })).unwrap();
        await dispatch(fetchAllServiceNames()).unwrap();
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();

    return () => {
      dispatch(clearError());
    };
  }, [serviceId, dispatch]);

  const handleBookNow = (roomId, e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/bookings/new?roomId=${roomId}`);
  };

  const handleCardClick = (roomId) => {
    navigate(`/rooms/${roomId}`);
  };

  const handleRetry = () => {
    dispatch(fetchAllRooms({ service: serviceId }));
  };

  // Filter rooms by serviceId if it exists
  const filteredRooms = serviceId
    ? rooms.filter((room) => room.service === serviceId)
    : rooms;

  // Function to get service name by ID
  const getServiceNameById = (service) => {
    if (!service) return "Service";

    // If service is an object with _id property
    const serviceId = typeof service === "object" ? service._id : service;

    const foundService = allServiceNames.find((s) => s._id === serviceId);

    return foundService
      ? foundService.name
      : typeof service === "object"
      ? service.name
      : "Service";
  };

  if (loading && status === "loading" && !rooms.length) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <LoadingSpinner size="large" />
        <div className="mt-4 text-gray-500">Loading rooms...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <ErrorMessage message={error.message || "Failed to load rooms"} />
        <div className="flex gap-4 mt-4">
          <Button onClick={handleRetry} variant="primary">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!filteredRooms.length) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          No Rooms Available
        </h2>
        <p className="text-gray-600 mb-6">
          There are currently no rooms available
          {serviceId ? " for this service" : ""}.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="mb-8"></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRooms.map((room) => (
          <motion.div
            key={room._id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={() => handleCardClick(room._id)}
            className="cursor-pointer"
          >
            <RoomsLandingCard
              room={room}
              serviceName={getServiceNameById(room.service)} // Pass service name as prop
              onBookNow={(e) => handleBookNow(room._id, e)}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RoomsLandingProfile;
