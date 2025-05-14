import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import RestaurantsProfileCard from "../../../components/features/RestaurantsCard/RestaurantsProfileCard";
import {
  fetchRestaurantsByService,
  selectRestaurants,
  selectRestaurantsLoading,
  selectRestaurantsError,
  selectCurrentRestaurant,
  clearRestaurants,
} from "../../../stores/Slices/restaurantSlice";
import {
  Button,
  ErrorMessage,
  SuccessMessage,
  LoadingSpinner,
} from "../../../components/Ui/index";
import {
  ArrowLeftIcon,
  HomeIcon,
  PlusIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

const RestaurantProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { serviceId } = useParams();

  // Select data from Redux store
  const restaurants = useSelector(selectRestaurants);
  const currentRestaurant = useSelector(selectCurrentRestaurant);
  const loading = useSelector(selectRestaurantsLoading);
  const error = useSelector(selectRestaurantsError);

  // Fetch restaurants when component mounts or serviceId changes
  // Fetch restaurants when component mounts or serviceId changes
  useEffect(() => {
    // Clear current restaurant when serviceId changes
    dispatch(clearRestaurants());

    if (serviceId) {
      dispatch(fetchRestaurantsByService(serviceId));
    }
  }, [serviceId, dispatch]);

  const handleBack = () => navigate(-1);

  const handleRefresh = () => {
    if (serviceId) {
      dispatch(fetchRestaurantsByService(serviceId));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-4 md:p-6"
    >
      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          icon={ArrowLeftIcon}
          iconPosition="left"
        >
          Back
        </Button>
        <div className="flex space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            icon={HomeIcon}
            iconPosition="right"
          >
            Home
          </Button>
          <Button
            variant="ghost"
            onClick={handleRefresh}
            icon={ArrowPathIcon}
            iconPosition="left"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-3 mb-6">
        {error && <ErrorMessage message={error} />}
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Restaurant Details
          </h1>
          <p className="text-gray-600 mb-8">
            Viewing restaurant information and menu
          </p>

          {currentRestaurant ? (
            <motion.div
              className="grid grid-cols-1 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <RestaurantsProfileCard
                restaurant={currentRestaurant}
                onCreate={() =>
                  navigate(`/restaurants/${currentRestaurant._id}`)
                }
              />
            </motion.div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm p-6">
              <p className="text-gray-500 text-lg mb-4">
                No restaurant found for this service
              </p>
              <Button
                variant="primary"
                onClick={handleRefresh}
                icon={ArrowPathIcon}
                iconPosition="left"
              >
                Try Again
              </Button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default RestaurantProfile;
