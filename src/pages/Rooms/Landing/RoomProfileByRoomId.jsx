import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  fetchRoomById,
  selectCurrentRoom,
  selectRoomsLoading,
  selectRoomsError,
  clearError,
} from "../../../stores/Slices/roomSlice";
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
import RoomProfileCardById from "../../../components/features/RoomsCard/RoomProfileCardById";

const RoomProfileByRoomId = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { roomId } = useParams();
  const isMounted = useRef(false);

  // Select data from Redux store
  const currentRoom = useSelector(selectCurrentRoom);
  const loading = useSelector(selectRoomsLoading);
  const error = useSelector(selectRoomsError);
  const allServiceNames = useSelector(selectAllServiceNames);
  const serviceNamesLoading = useSelector(selectServiceNamesLoading);

  // Find the service name for the current room
  const currentService = allServiceNames.find(
    (service) => service._id === currentRoom?.service?._id
  );

  // Fetch room and service names when component mounts or roomId changes
  useEffect(() => {
    if (isMounted.current && roomId) {
      const fetchData = async () => {
        try {
          await dispatch(fetchRoomById(roomId)).unwrap();
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
  }, [roomId, dispatch]);

  const handleBack = () => navigate(-1);
  const handleBookRoom = () => {
    navigate(`/room/${roomId}/bookings`);
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
      ) : currentRoom ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {currentService?.name || "Service Name Not Available"}
          </h1>
          <RoomProfileCardById
            room={currentRoom}
            onBook={handleBookRoom}
            showFullDetails={true}
          />
        </motion.div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-500 text-lg mb-4">
            {errorMessage || "Room not found"}
          </p>
          <Button variant="primary" onClick={handleBack}>
            Back to Rooms
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default RoomProfileByRoomId;
