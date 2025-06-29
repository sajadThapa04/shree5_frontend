import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  fetchAllRestaurants,
  selectRestaurants,
  selectRestaurantsLoading,
  selectRestaurantsError,
  selectRestaurantsStatus,
  clearError,
} from "../../../stores/Slices/restaurantSlice";
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
import RestaurantLandingCard from "../../../components/Landing/Restaurants/RestaurantLandingCard";

const RestaurantLandingProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { serviceId } = useParams();

  // Select data from Redux store
  const restaurants = useSelector(selectRestaurants);
  const loading = useSelector(selectRestaurantsLoading);
  const error = useSelector(selectRestaurantsError);
  const status = useSelector(selectRestaurantsStatus);
  const allServiceNames = useSelector(selectAllServiceNames);

  // Fetch restaurants and service names when component mounts or serviceId changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Always fetch when serviceId changes or component mounts
        await dispatch(fetchAllRestaurants({ service: serviceId })).unwrap();
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

  const handleReserveTable = (restaurantId, e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/bookings/new?restaurantId=${restaurantId}`);
  };

  const handleCardClick = (restaurantId) => {
    navigate(`/restaurants/${restaurantId}`);
  };

  const handleRetry = () => {
    dispatch(fetchAllRestaurants({ service: serviceId }));
  };

  // Filter restaurants by serviceId if it exists
  const filteredRestaurants = serviceId
    ? restaurants.filter((restaurant) => restaurant.service === serviceId)
    : restaurants;

  // Function to get service name by ID
  const getServiceNameById = (service) => {
    if (!service) return "Restaurant";

    // If service is an object with _id property
    const serviceId = typeof service === "object" ? service._id : service;

    const foundService = allServiceNames.find((s) => s._id === serviceId);

    return foundService
      ? foundService.name
      : typeof service === "object"
      ? service.name
      : "Restaurant";
  };

  if (loading && status === "loading" && !restaurants.length) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <LoadingSpinner size="large" />
        <div className="mt-4 text-gray-500">Loading restaurants...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <ErrorMessage message={error.message || "Failed to load restaurants"} />
        <div className="flex gap-4 mt-4">
          <Button onClick={handleRetry} variant="primary">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!filteredRestaurants.length) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          No Restaurants Available
        </h2>
        <p className="text-gray-600 mb-6">
          There are currently no restaurants available
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
      <div className="mb-8">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          icon={ArrowLeftIcon}
          iconPosition="left"
          className="mb-4"
        >
          Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">
          {serviceId ? getServiceNameById(serviceId) : "All Restaurants"}
        </h1>
        <p className="text-gray-600 mt-2">
          {filteredRestaurants.length} restaurant(s) available
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRestaurants.map((restaurant) => (
          <motion.div
            key={restaurant._id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={() => handleCardClick(restaurant._id)}
            className="cursor-pointer"
          >
            <RestaurantLandingCard
              restaurant={restaurant}
              serviceName={getServiceNameById(restaurant.service)}
              onBookNow={(e) => handleReserveTable(restaurant._id, e)}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RestaurantLandingProfile;
