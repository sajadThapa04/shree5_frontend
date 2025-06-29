import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  fetchRestaurantById,
  selectCurrentRestaurant,
  selectRestaurantsLoading,
  selectRestaurantsError,
  clearError,
} from "../../../stores/Slices/restaurantSlice";
import {
  fetchAllServiceNames,
  selectAllServiceNames,
  selectServiceNamesLoading,
} from "../../../stores/Slices/serviceSlice";
import {
  Button,
  ErrorMessage,
  LoadingSpinner,
} from "../../../components/Ui/index";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import RestaurantProfileCardById from "../../../components/features/RestaurantsCard/RestaurantProfileCardById";
const RestaurantProfileByRestaurantId = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { restaurantId } = useParams();
  const isMounted = useRef(false);

  // Select data from Redux store
  const currentRestaurant = useSelector(selectCurrentRestaurant);
  const loading = useSelector(selectRestaurantsLoading);
  const error = useSelector(selectRestaurantsError);
  const allServiceNames = useSelector(selectAllServiceNames);
  const serviceNamesLoading = useSelector(selectServiceNamesLoading);

  // Find the service name for the current restaurant
  const currentService = allServiceNames.find(
    (service) => service._id === currentRestaurant?.service?._id
  );

  // Fetch restaurant and service names when component mounts or restaurantId changes
  useEffect(() => {
    if (isMounted.current && restaurantId) {
      const fetchData = async () => {
        try {
          await dispatch(fetchRestaurantById(restaurantId)).unwrap();
          await dispatch(fetchAllServiceNames()).unwrap();
        } catch (err) {
          console.error("Failed to fetch data:", err);
        }
      };
      fetchData();
    }
    isMounted.current = true;

    return () => {
      dispatch(clearError());
    };
  }, [restaurantId, dispatch]);

  const handleBack = () => navigate(-1);
  const handleReserveTable = () => {
    navigate(`/restaurant/${restaurantId}/reservations`);
  };

  const isLoading = loading || serviceNamesLoading;

  // Safely extract error message
  const getErrorMessage = () => {
    if (!error) return null;

    if (typeof error === "string") return error;

    if (typeof error === "object") {
      return error.message || error.status || "An error occurred";
    }

    return "An unknown error occurred";
  };

  const errorMessage = getErrorMessage();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-4 md:p-6"
    >
      {errorMessage && (
        <div className="mb-6">
          <ErrorMessage message={errorMessage} />
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : currentRestaurant ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-6">
            <Button
              onClick={handleBack}
              variant="ghost"
              icon={ArrowLeftIcon}
              iconPosition="left"
            >
              Back
            </Button>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {currentService?.name || "Restaurant Details"}
          </h1>
          <RestaurantProfileCardById
            restaurant={currentRestaurant}
            onReserve={handleReserveTable}
          />
        </motion.div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-500 text-lg mb-4">
            {errorMessage || "Restaurant not found"}
          </p>
          <Button variant="primary" onClick={handleBack}>
            Back to Restaurants
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default RestaurantProfileByRestaurantId;
