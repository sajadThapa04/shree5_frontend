import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import EditProfile from "../../../components/features/HostCard/EditProfile/EditProfile";
import ServiceProfile from "../../Services/ServiceProfile/ServiceProfile";
import {
  fetchHostsByUser,
  selectHostsList,
  selectHostLoading,
  selectHostError,
} from "../../../stores/Slices/hostSlice";
import { motion } from "framer-motion";
import {
  BuildingStorefrontIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CalendarIcon,
  StarIcon,
  CheckBadgeIcon,
  HomeIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { Button } from "../../../components/Ui";
import {
  ErrorMessage,
  SuccessMessage,
} from "../../../components/Ui/Message/AlertMessage";

const HostProfileView = ({
  host,
  userId,
  handleBack,
  showFullDesc,
  setShowFullDesc,
  maxLength,
  formattedDate,
  truncateText,
  navigate,
}) => {
  const handleViewListings = () => {
    // Navigate to the ServiceProfile component with the host's ID
    navigate(`/host/${host?._id}/services`);
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Host Image/Icon */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <div className="h-32 w-32 rounded-full bg-rose-50 flex items-center justify-center shadow-inner border-2 border-rose-100">
              <BuildingStorefrontIcon className="h-16 w-16 text-rose-600" />
            </div>
            {host.isFeatured && (
              <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                <StarIcon className="h-4 w-4 mr-1" />
                Featured Host
              </div>
            )}
          </div>

          {/* Host Details */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {host.name}
                </h1>
                <div className="flex items-center">
                  {host.status === "active" && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                      <CheckBadgeIcon className="h-3 w-3 mr-1" />
                      Verified
                    </span>
                  )}
                  <span className="text-gray-500 text-sm capitalize">
                    {host.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-gray-700 mb-8 leading-relaxed">
              {host.description && (
                <>
                  <div className="whitespace-pre-line">
                    <ReactMarkdown
                      components={{
                        p: ({ node, ...props }) => (
                          <p className="mb-4" {...props} />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul className="mt-4 mb-6 pl-0 list-none" {...props} />
                        ),
                        li: ({ node, ...props }) => {
                          const isEmojiItem =
                            typeof props.children[0] === "string" &&
                            props.children[0].match(/\p{Emoji}/u);

                          return (
                            <li className="flex items-start mb-2">
                              {isEmojiItem && (
                                <span className="mr-2 flex-shrink-0">
                                  {props.children[0]}
                                </span>
                              )}
                              <span>
                                {isEmojiItem
                                  ? props.children.slice(1)
                                  : props.children}
                              </span>
                            </li>
                          );
                        },
                      }}
                    >
                      {showFullDesc || host.description.length <= maxLength
                        ? host.description
                        : truncateText(host.description)}
                    </ReactMarkdown>
                  </div>

                  {host.description.length > maxLength && (
                    <button
                      onClick={() => setShowFullDesc(!showFullDesc)}
                      className="mt-2 text-rose-600 hover:underline text-sm font-medium"
                    >
                      {showFullDesc ? "Show less" : "Read more"}
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start">
                <div className="bg-rose-50 p-2 rounded-lg mr-4">
                  <PhoneIcon className="h-5 w-5 text-rose-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Phone
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {host.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-rose-50 p-2 rounded-lg mr-4">
                  <EnvelopeIcon className="h-5 w-5 text-rose-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Email
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {host.email}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-rose-50 p-2 rounded-lg mr-4">
                  <MapPinIcon className="h-5 w-5 text-rose-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Address
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {host.address.street}, {host.address.city},{" "}
                    {host.address.country},{host.address.zipCode}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-rose-50 p-2 rounded-lg mr-4">
                  <CalendarIcon className="h-5 w-5 text-rose-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Member Since
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {formattedDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Policies */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Policies
              </h3>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-600 mr-2">
                  Cancellation:
                </span>
                <span className="text-sm font-medium capitalize bg-white px-2 py-1 rounded-md border border-gray-200">
                  {host.policies.cancellation}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
          <Button
            variant="primary"
            onClick={() => navigate(`/host/user/${userId}/edit`)}
            className="w-full sm:w-auto"
          >
            Edit Profile
          </Button>
          <Button
            variant="secondary"
            onClick={handleViewListings}
            className="w-full sm:w-auto"
          >
            View Listings
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const HostProfile = () => {
  const [showFullDesc, setShowFullDesc] = useState(false);
  const maxLength = 200;

  const truncateText = (text) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Select data from Redux store
  const hostsList = useSelector(selectHostsList);
  const host = hostsList?.[0] || null; // Get first host or null if empty
  const loading = useSelector(selectHostLoading);
  const error = useSelector(selectHostError);

  useEffect(() => {
    if (userId) {
      dispatch(fetchHostsByUser(userId));
    }
  }, [userId, dispatch]);

  // Format creation date
  const formattedDate = host?.createdAt
    ? new Date(host.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-4 md:p-6 mt-10"
    >
      {/* Navigation Buttons */}
      <div className="flex justify-between mb-8">
        <motion.button
          onClick={handleBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-300"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span className="font-medium">Back</span>
        </motion.button>

        <motion.button
          onClick={() => navigate("/")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-all duration-300"
        >
          <HomeIcon className="h-5 w-5" />
          <span className="font-medium">Home</span>
        </motion.button>
      </div>

      {/* Messages */}
      <div className="space-y-3 mb-6">
        {error && (
          <ErrorMessage
            message={error.message || "Failed to load host profile"}
          />
        )}
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
        </div>
      ) : host ? (
        <Routes>
          <Route
            path="/"
            element={
              <HostProfileView
                host={host}
                userId={userId}
                handleBack={handleBack}
                showFullDesc={showFullDesc}
                setShowFullDesc={setShowFullDesc}
                maxLength={maxLength}
                formattedDate={formattedDate}
                truncateText={truncateText}
                navigate={navigate}
              />
            }
          />
          <Route path="/edit" element={<EditProfile />} />
          <Route path="/services" element={<ServiceProfile />} />
        </Routes>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-500 text-lg mb-4">No host data available</p>
          <div className="flex justify-center gap-4">
            <Button
              variant="secondary"
              onClick={handleBack}
              className="w-full sm:w-auto"
            >
              Go Back
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate("/")}
              className="w-full sm:w-auto"
            >
              Go Home
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default HostProfile;
