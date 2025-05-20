import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import RoomProfileCard from "../../../components/features/RoomsCard/RoomProfileCard";
import {
  fetchRoomsByService,
  selectRooms,
  selectRoomsLoading,
  selectRoomsError,
  selectCurrentRoom,
  clearRooms,
} from "../../../stores/Slices/roomSlice";
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
import { selectHasActiveHost } from "../../../stores/Slices/hostSlice";

const RoomProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { serviceId } = useParams();

  // Select data from Redux store
  const rooms = useSelector(selectRooms);
  const currentRoom = useSelector(selectCurrentRoom);
  const loading = useSelector(selectRoomsLoading);
  const error = useSelector(selectRoomsError);
  const hasActiveHost = useSelector(selectHasActiveHost);

  // Get user info directly from the user state
  const currentUser = useSelector((state) => state.user.userInfo);

  // Determine if this is a host view
  const isHostView = hasActiveHost || currentUser?.role === "host";

  // Fetch rooms when component mounts or serviceId changes
  useEffect(() => {
    // Clear current room when serviceId changes
    dispatch(clearRooms());

    if (serviceId) {
      dispatch(fetchRoomsByService(serviceId));
    }
  }, [serviceId, dispatch]);

  const handleBack = () => navigate(-1);

  const handleRefresh = () => {
    if (serviceId) {
      dispatch(fetchRoomsByService(serviceId));
    }
  };

  const handleBookRoom = (room) => {
    navigate(`/bookings/new?roomId=${room._id}`);
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
            Room Details
          </h1>
          <p className="text-gray-600 mb-8">
            {isHostView
              ? "Manage your room details"
              : "Viewing room information and availability"}
          </p>

          {currentRoom ? (
            <motion.div
              className="grid grid-cols-1 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <RoomProfileCard
                room={currentRoom}
                onBook={isHostView ? undefined : handleBookRoom}
                isLoading={loading}
                isHostView={isHostView}
              />
            </motion.div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm p-6">
              <p className="text-gray-500 text-lg mb-4">
                No room found for this service
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

export default RoomProfile;
