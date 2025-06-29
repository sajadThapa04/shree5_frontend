import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  fetchRoomsPaginated,
  selectRooms,
  selectRoomsLoading,
  selectRoomsError,
  selectRoomsStatus,
  selectHasMore,
  clearError,
  clearRooms,
  resetPagination
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

const useInfiniteScroll = ({ loading, hasMore, onLoadMore }) => {
  const observer = useRef();
  const lastElementRef = useRef();

  const handleObserver = useCallback(
    (entries) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !loading) {
        onLoadMore();
      }
    },
    [loading, hasMore, onLoadMore]
  );

  useEffect(() => {
    const currentObserver = observer.current;
    const currentElement = lastElementRef.current;

    if (currentObserver) {
      currentObserver.disconnect();
    }

    observer.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    });

    if (currentElement) {
      observer.current.observe(currentElement);
    }

    return () => {
      if (currentObserver) {
        currentObserver.disconnect();
      }
    };
  }, [handleObserver]);

  return [lastElementRef];
};

const RoomsLandingProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { serviceId } = useParams();
  const [page, setPage] = useState(1);
  const [initialLoad, setInitialLoad] = useState(true);

  // Select data from Redux store
  const rooms = useSelector(selectRooms);
  const loading = useSelector(selectRoomsLoading);
  const error = useSelector(selectRoomsError);
  const status = useSelector(selectRoomsStatus);
  const hasMore = useSelector(selectHasMore);
  const allServiceNames = useSelector(selectAllServiceNames);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Reset rooms when serviceId changes
        dispatch(resetPagination());
        setPage(1);

        await Promise.all([
          dispatch(
            fetchRoomsPaginated({ service: serviceId, page: 1, limit: 12 })
          ).unwrap(),
          dispatch(fetchAllServiceNames()).unwrap(),
        ]);

        setInitialLoad(false);
      } catch (err) {
        console.error("Failed to fetch initial data:", err);
      }
    };

    fetchInitialData();

    return () => {
      dispatch(clearError());
    };
  }, [serviceId, dispatch]);

  // Fetch more rooms when reaching bottom
  const loadMore = useCallback(() => {
    if (!loading && hasMore && !initialLoad) {
      dispatch(
        fetchRoomsPaginated({ service: serviceId, page: page + 1, limit: 12 })
      );
      setPage((prevPage) => prevPage + 1);
    }
  }, [loading, hasMore, page, serviceId, dispatch, initialLoad]);

  // Infinite scroll hook
  const [infiniteRef] = useInfiniteScroll({
    loading,
    hasMore,
    onLoadMore: loadMore,
  });

  const handleBookNow = (roomId, e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/bookings/new?roomId=${roomId}`);
  };

  const handleCardClick = (roomId) => {
    navigate(`/rooms/${roomId}`);
  };

  const handleRetry = () => {
    dispatch(resetPagination());
    setPage(1);
    dispatch(fetchRoomsPaginated({ service: serviceId, page: 1, limit: 12 }));
  };

  const getServiceNameById = (service) => {
    if (!service) return "Service";

    const serviceId = typeof service === "object" ? service._id : service;
    const foundService = allServiceNames.find((s) => s._id === serviceId);

    return foundService
      ? foundService.name
      : typeof service === "object"
      ? service.name
      : "Service";
  };

  const getServiceCountry = (service) => {
    if (!service) return null;

    const serviceId = typeof service === "object" ? service._id : service;
    const foundService = allServiceNames.find((s) => s._id === serviceId);

    return foundService
      ? foundService.country
      : typeof service === "object"
      ? service.country
      : null;
  };

  if (initialLoad && status === "loading") {
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

  if (!rooms.length && !initialLoad) {
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
        {rooms.map((room) => (
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
              serviceName={getServiceNameById(room.service)}
              serviceCountry={getServiceCountry(room.service)}
              onBookNow={(e) => handleBookNow(room._id, e)}
            />
          </motion.div>
        ))}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={infiniteRef} className="h-10 flex justify-center items-center">
        {loading && <LoadingSpinner size="medium" />}
        {!hasMore && rooms.length > 0 && (
          <p className="text-gray-500">No more rooms to load</p>
        )}
      </div>
    </motion.div>
  );
};

export default RoomsLandingProfile;