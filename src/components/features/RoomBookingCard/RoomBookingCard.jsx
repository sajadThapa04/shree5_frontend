import React, { useState } from "react";
import { Card } from "../../Ui";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBed,
  FaCalendarAlt,
  FaUser,
  FaTimes,
  FaCreditCard,
  FaPaypal,
} from "react-icons/fa";
import { SiRazorpay } from "react-icons/si";
import { useForm } from "react-hook-form";
import DatePicker from "../../Ui/form/DatePicker";
import { Button } from "../../Ui/index";
import { calculateTotalPrice } from "../../../utils/calculateTotalPrice";
import {
  GuestInfoForm,
  ImageGallery,
  PriceSummary,
  RoomStats,
} from "./Components";

const PAYMENT_METHODS = [
  {
    id: "stripe",
    name: "Credit/Debit Card",
    icon: <FaCreditCard className="mr-2" />,
    available: true,
  },
  {
    id: "paypal",
    name: "PayPal",
    icon: <FaPaypal className="mr-2" />,
    available: false,
  },
  {
    id: "razorpay",
    name: "Razorpay",
    icon: <SiRazorpay className="mr-2" />,
    available: false,
  },
];

const RoomBookingCard = ({
  room,
  onBook,
  isLoading,
  isGuest = false,
  user,
  bookingData,
}) => {
  // Validate required props
  if (!room || !room._id || !room.host || !room.service) {
    return (
      <div className="text-center p-4 text-red-500">
        Error: Incomplete room data provided
      </div>
    );
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useForm({
    defaultValues: {
      checkInDate: bookingData?.checkInDate || "",
      checkOutDate: bookingData?.checkOutDate || "",
      numberOfGuests: bookingData?.numberOfGuests || 1,
      specialRequests: bookingData?.specialRequests || "",
      paymentMethod: bookingData?.paymentMethod || "stripe",
      ...(isGuest && {
        guestInfo: {
          fullName: bookingData?.guestInfo?.fullName || "",
          email: bookingData?.guestInfo?.email || "",
          phone: bookingData?.guestInfo?.phone || "",
        },
      }),
    },
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const checkInDate = watch("checkInDate");
  const checkOutDate = watch("checkOutDate");
  const numberOfGuests = watch("numberOfGuests");
  const paymentMethod = watch("paymentMethod");

  // Calculate total price with validation
  const totalPrice =
    calculateTotalPrice(room?.pricePerNight, checkInDate, checkOutDate) || 0;

  const handleDateChange = (name, date) => {
    if (!date) return;
    setValue(name, date, { shouldValidate: true });
  };

  const onSubmit = (data) => {
    if (!data.checkInDate || !data.checkOutDate) {
      console.error("Missing check-in/check-out dates");
      return;
    }

    // Ensure dates are properly formatted
    const bookingDetails = {
      ...data,
      checkInDate: data.checkInDate.toISOString(), // UTC
      checkOutDate: data.checkOutDate.toISOString(),
      host: room.host,
      service: room.service,
      room: room._id,
      totalPrice: calculateTotalPrice(
        room?.pricePerNight,
        new Date(data.checkInDate),
        new Date(data.checkOutDate)
      ),
      paymentMethod: data.paymentMethod || "stripe",
      numberOfGuests: Number(data.numberOfGuests),
    };

    onBook(bookingDetails);
  };

  const {
    name,
    roomType,
    pricePerNight,
    capacity = { adults: 1, children: 0 }, // Default capacity
    size,
    amenities = [],
    tags = [],
    images = [],
    isAvailable,
  } = room;

  // Calculate max guests with fallback
  const maxGuests = (capacity?.adults || 1) + (capacity?.children || 0);

  return (
    <>
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative w-full max-w-6xl h-full flex items-center justify-center">
              <button
                className="absolute top-4 right-4 md:top-8 md:right-8 bg-black/70 text-white p-2 rounded-full hover:bg-black transition-colors z-50"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(null);
                }}
                aria-label="Close image"
              >
                <FaTimes className="h-6 w-6" />
              </button>

              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="relative w-full h-full max-h-[90vh] flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedImage}
                  alt={`Fullscreen view - ${name}`}
                  className="max-w-full max-h-full object-contain rounded-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder-room.jpg";
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="flex flex-col lg:flex-row gap-8"
        >
          {/* Left Column - Room Summary */}
          <div className="flex-shrink-0 w-full lg:w-2/5 space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
              <div className="flex items-center gap-2 text-gray-600">
                <FaBed className="text-rose-500" />
                <span className="capitalize">{roomType}</span>
              </div>

              <ImageGallery
                images={images}
                name={name}
                onImageClick={setSelectedImage}
              />
              <RoomStats capacity={capacity} size={size} roomType={roomType} />
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div className="flex-1">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Book Your Stay
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FaCalendarAlt className="inline mr-2 text-rose-500" />
                      Check-in
                    </label>
                    <DatePicker
                      selected={checkInDate}
                      onChange={(date) => handleDateChange("checkInDate", date)}
                      minDate={new Date()}
                      placeholderText="Select date"
                      className="w-full"
                      error={errors.checkInDate}
                      required
                    />
                    {errors.checkInDate && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.checkInDate.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FaCalendarAlt className="inline mr-2 text-rose-500" />
                      Check-out
                    </label>
                    <DatePicker
                      selected={checkOutDate}
                      onChange={(date) =>
                        handleDateChange("checkOutDate", date)
                      }
                      minDate={checkInDate || new Date()}
                      placeholderText="Select date"
                      className="w-full"
                      error={errors.checkOutDate}
                      required
                    />
                    {errors.checkOutDate && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.checkOutDate.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaUser className="inline mr-2 text-rose-500" />
                    Guests
                  </label>
                  <select
                    {...register("numberOfGuests", {
                      required: "Number of guests is required",
                      min: {
                        value: 1,
                        message: "At least 1 guest is required",
                      },
                      max: {
                        value: maxGuests,
                        message: `Maximum ${maxGuests} guests allowed`,
                      },
                      valueAsNumber: true, // This will convert the value to number
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
                  >
                    {[...Array(maxGuests).keys()].map((num) => (
                      <option key={num + 1} value={num + 1}>
                        {num + 1} {num + 1 === 1 ? "guest" : "guests"}
                      </option>
                    ))}
                  </select>
                  {errors.numberOfGuests && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.numberOfGuests.message}
                    </p>
                  )}
                </div>

                {isGuest && (
                  <GuestInfoForm
                    register={register}
                    errors={errors}
                    roomCapacity={capacity}
                    control={control}
                    setValue={setValue}
                  />
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Requests
                  </label>
                  <textarea
                    {...register("specialRequests", {
                      maxLength: {
                        value: 500,
                        message:
                          "Special requests cannot exceed 500 characters",
                      },
                    })}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
                    placeholder="Any special requirements or notes..."
                  />
                  {errors.specialRequests && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.specialRequests.message}
                    </p>
                  )}
                </div>

                {/* Payment Method Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Payment Method
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {PAYMENT_METHODS.map((method) => (
                      <div key={method.id}>
                        <input
                          type="radio"
                          id={`payment-${method.id}`}
                          value={method.id}
                          {...register("paymentMethod", {
                            required: "Payment method is required",
                          })}
                          className="hidden peer"
                          disabled={!method.available}
                        />
                        <label
                          htmlFor={`payment-${method.id}`}
                          className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                            paymentMethod === method.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-300"
                          } ${
                            !method.available
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:border-blue-300"
                          }`}
                        >
                          {method.icon}
                          <span>{method.name}</span>
                          {!method.available && (
                            <span className="ml-2 text-xs text-gray-500">
                              (Coming soon)
                            </span>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.paymentMethod && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.paymentMethod.message}
                    </p>
                  )}
                </div>
              </div>

              <PriceSummary
                pricePerNight={pricePerNight}
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                totalPrice={totalPrice}
              />

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isLoading || !isAvailable}
                  className="w-full py-4 rounded-lg text-lg font-medium"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : !isAvailable ? (
                    "Room Not Available"
                  ) : (
                    "Confirm Booking"
                  )}
                </Button>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </Card>
    </>
  );
};

export default RoomBookingCard;
