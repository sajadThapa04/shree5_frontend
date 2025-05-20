import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../../Ui/index";
import {
  ArrowLeftIcon,
  CalendarIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import {
  createGuestBooking,
  createUserBooking,
} from "../../../services/roomBooking.api";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const RoomBookingForms = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { room, service, host } = location.state || {};
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000), // +1 day
      key: "selection",
    },
  ]);
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      specialRequests: "",
      ...(isAuthenticated
        ? {}
        : {
            guestInfo: {
              fullName: "",
              email: "",
              phone: "",
            },
          }),
    },
  });

  // Calculate total price when dates or guests change
  useEffect(() => {
    if (room?.pricePerNight) {
      const diffTime = Math.abs(dateRange[0].endDate - dateRange[0].startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setTotalPrice(diffDays * room.pricePerNight * numberOfGuests);
    }
  }, [dateRange, numberOfGuests, room]);

  const handleDateSelect = (ranges) => {
    setDateRange([ranges.selection]);
    setIsDatePickerOpen(false);
  };

  const incrementGuests = () => {
    if (
      numberOfGuests < (room?.capacity?.adults + room?.capacity?.children || 10)
    ) {
      setNumberOfGuests(numberOfGuests + 1);
    }
  };

  const decrementGuests = () => {
    if (numberOfGuests > 1) {
      setNumberOfGuests(numberOfGuests - 1);
    }
  };

  const onSubmit = async (data) => {
    if (!room || !service || !host) {
      toast.error("Missing room information");
      return;
    }

    setIsSubmitting(true);
    try {
      const bookingData = {
        host: host._id,
        service: service._id,
        room: room._id,
        checkInDate: dateRange[0].startDate,
        checkOutDate: dateRange[0].endDate,
        numberOfGuests,
        totalPrice,
        paymentMethod: "stripe", // Default for now
        specialRequests: data.specialRequests,
      };

      let result;
      if (isAuthenticated) {
        result = await createUserBooking(bookingData);
      } else {
        bookingData.guestInfo = data.guestInfo;
        result = await createGuestBooking(bookingData);
      }

      if (result.success) {
        toast.success("Booking created successfully!");
        navigate("/bookings");
      } else {
        toast.error(result.error || "Failed to create booking");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred during booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!room || !service || !host) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Room Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't find the room you're trying to book. Please go back and
            try again.
          </p>
          <Button
            variant="primary"
            onClick={() => navigate("/stays")}
            className="px-6 py-3"
          >
            Back to Stays
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            className="flex items-center"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">
            Complete Your Booking
          </h1>
          <p className="text-gray-600 mt-2">
            {room.name} at {service.name}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Your Trip Details
              </h2>

              <div className="space-y-6">
                {/* Dates */}
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    Dates
                  </h3>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                      className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:border-rose-500 transition-colors"
                    >
                      <span>
                        {dateRange[0].startDate.toLocaleDateString()} -{" "}
                        {dateRange[0].endDate.toLocaleDateString()}
                      </span>
                      <CalendarIcon className="h-5 w-5 text-gray-500" />
                    </button>
                    {isDatePickerOpen && (
                      <div className="absolute z-10 mt-1 bg-white shadow-lg rounded-lg p-4">
                        <DateRangePicker
                          ranges={dateRange}
                          onChange={handleDateSelect}
                          minDate={new Date()}
                          rangeColors={["#f43f5e"]}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Guests */}
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    Guests
                  </h3>
                  <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                    <div className="flex items-center">
                      <UserIcon className="h-5 w-5 text-gray-500 mr-2" />
                      <span>
                        {numberOfGuests} guest{numberOfGuests !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={decrementGuests}
                        disabled={numberOfGuests <= 1}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 disabled:opacity-50"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={incrementGuests}
                        disabled={
                          numberOfGuests >=
                          room.capacity.adults + room.capacity.children
                        }
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    Special Requests (Optional)
                  </h3>
                  <textarea
                    {...register("specialRequests")}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="Any special requirements or notes for your stay..."
                  />
                </div>

                {/* Guest Information for non-authenticated users */}
                {!isAuthenticated && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      Guest Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          {...register("guestInfo.fullName", {
                            required: "Full name is required",
                          })}
                          type="text"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        />
                        {errors.guestInfo?.fullName && (
                          <p className="mt-1 text-sm text-rose-600">
                            {errors.guestInfo.fullName.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          {...register("guestInfo.email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Invalid email address",
                            },
                          })}
                          type="email"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        />
                        {errors.guestInfo?.email && (
                          <p className="mt-1 text-sm text-rose-600">
                            {errors.guestInfo.email.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          {...register("guestInfo.phone")}
                          type="tel"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          placeholder="Optional"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Booking Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {room.pricePerNight} × {numberOfGuests} guest
                    {numberOfGuests !== 1 ? "s" : ""} ×{" "}
                    {Math.ceil(
                      (dateRange[0].endDate - dateRange[0].startDate) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    night
                    {Math.ceil(
                      (dateRange[0].endDate - dateRange[0].startDate) /
                        (1000 * 60 * 60 * 24)
                    ) !== 1
                      ? "s"
                      : ""}
                  </span>
                  <span className="font-medium">${totalPrice}</span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  className="w-full mt-6 py-3 text-lg font-medium rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                >
                  {isSubmitting ? (
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
                  ) : (
                    "Confirm Booking"
                  )}
                </Button>

                {!isAuthenticated && (
                  <p className="text-sm text-gray-500 mt-4 text-center">
                    By booking, you agree to our{" "}
                    <a href="/terms" className="text-rose-600 hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy"
                      className="text-rose-600 hover:underline"
                    >
                      Privacy Policy
                    </a>
                    .
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomBookingForms;
