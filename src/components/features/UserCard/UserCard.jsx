import React, { useState } from "react";
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  StarIcon,
  ShieldCheckIcon,
  ClockIcon,
  XMarkIcon,
  CheckBadgeIcon,
  CameraIcon,
} from "@heroicons/react/24/outline";
import { Card, Modal } from "../../Ui";
import { motion } from "framer-motion";
import UploadProfileImageForm from "../../UploadProfileImg/UploadProfileImageForm";
const UserCard = ({ user }) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  if (!user) {
    console.error("UserCard: No user data provided");
    return (
      <div className="text-center p-8 text-red-500">Error: No user data</div>
    );
  }

  const {
    fullName = "Guest User",
    email = "No email provided",
    phone = "No phone provided",
    role = "traveler",
    profileImage,
    status = "active",
    isEmailVerified = false,
    isPhoneVerified = false,
    Booking = [],
    savedListings = [],
  } = user;

  // Status configuration
  const statusConfig = {
    active: { color: "bg-green-100 text-green-800", icon: ShieldCheckIcon },
    inactive: { color: "bg-gray-100 text-gray-800", icon: ClockIcon },
    banned: { color: "bg-red-100 text-red-800", icon: XMarkIcon },
    pending: { color: "bg-amber-100 text-amber-800", icon: ClockIcon },
  };

  const StatusIcon = statusConfig[status]?.icon || ClockIcon;
  const statusColor =
    statusConfig[status]?.color || "bg-gray-100 text-gray-800";

  return (
    <>
      <Card className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Image with Hover Animation */}
          <div className="flex-shrink-0">
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="relative"
              >
                {profileImage === "default-profile.png" ? (
                  <div className="h-32 w-32 rounded-full bg-rose-100 flex items-center justify-center overflow-hidden relative">
                    <span className="text-3xl font-bold text-rose-600">
                      {fullName.charAt(0).toUpperCase()}
                    </span>
                    {isEmailVerified && (
                      <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 transform translate-x-1/4 translate-y-1/4">
                        <CheckBadgeIcon className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative h-32 w-32">
                    <img
                      src={profileImage}
                      alt={fullName}
                      className="h-full w-full rounded-full object-cover border-4 border-rose-100"
                    />
                    {isEmailVerified && (
                      <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 transform translate-x-1/4 translate-y-1/4">
                        <CheckBadgeIcon className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                )}
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="absolute bottom-0 left-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                  aria-label="Change profile picture"
                >
                  <CameraIcon className="h-5 w-5 text-gray-700" />
                </button>
              </motion.div>
              <div
                className={`mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}
              >
                <StatusIcon className="h-4 w-4 mr-1" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </div>
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-900">{fullName}</h2>
              {isEmailVerified && (
                <CheckBadgeIcon className="h-6 w-6 text-blue-500" />
              )}
            </div>

            <p className="text-gray-500 mb-4">
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </p>

            {/* Verification Status */}
            <div className="flex gap-2 mb-4">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                  isEmailVerified
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-50 text-gray-700"
                }`}
              >
                {isEmailVerified ? (
                  <CheckBadgeIcon className="h-4 w-4 mr-1.5 text-green-500" />
                ) : (
                  <EnvelopeIcon className="h-4 w-4 mr-1.5 text-gray-500" />
                )}
                {isEmailVerified ? "Verified Email" : "Unverified Email"}
              </span>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                  isPhoneVerified
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-50 text-gray-700"
                }`}
              >
                {isPhoneVerified ? (
                  <CheckBadgeIcon className="h-4 w-4 mr-1.5 text-green-500" />
                ) : (
                  <PhoneIcon className="h-4 w-4 mr-1.5 text-gray-500" />
                )}
                {isPhoneVerified ? "Verified Phone" : "Unverified Phone"}
              </span>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-start">
                <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase">
                    Email
                  </p>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {email}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <PhoneIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase">
                    Phone
                  </p>
                  <p className="text-sm font-medium text-gray-900">{phone}</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-xs font-medium text-gray-500 uppercase">
                  Bookings
                </p>
                <p className="text-lg font-bold text-rose-600">
                  {Booking.length}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-xs font-medium text-gray-500 uppercase">
                  Saved
                </p>
                <p className="text-lg font-bold text-rose-600">
                  {savedListings.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Profile Image Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Update Profile Picture"
      >
        <UploadProfileImageForm
          user={user}
          onClose={() => setIsUploadModalOpen(false)}
          onUserProfileImageUpdate={(newImageUrl) => {
            // This will update the local state immediately
            // The Redux update will handle the persistent change
          }}
        />
      </Modal>
    </>
  );
};

export default UserCard;
