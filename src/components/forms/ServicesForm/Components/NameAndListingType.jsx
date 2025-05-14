import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  IoRestaurant,
  IoBusiness,
  IoHome,
  IoStar,
  IoLocation,
  IoHelpCircle,
} from "react-icons/io5";
import { GiWoodCabin } from "react-icons/gi";

const NameAndListingType = ({ register, errors, setValue, watch }) => {
  const { hostsList } = useSelector((state) => state.host);
  const listingType = watch("type");

  // Get the first active host's name
  const activeHost = hostsList?.find((host) => host.status === "active");
  const hostName = activeHost?.name || "";

  // Automatically set the service name when component mounts
  useEffect(() => {
    if (hostName) {
      setValue("name", `${hostName}`);
    }
  }, [hostName, setValue]);

  const listingTypes = [
    {
      value: "restaurant",
      label: "Restaurant",
      icon: IoRestaurant,
      color: "text-red-500",
    },
    {
      value: "hotel",
      label: "Hotel",
      icon: IoBusiness,
      color: "text-blue-500",
    },
    {
      value: "lodge",
      label: "Lodge",
      icon: GiWoodCabin, // Keeping this from Gi as Ionicons doesn't have a cabin icon
      color: "text-amber-700",
    },
    {
      value: "home_stay",
      label: "Home Stay",
      icon: IoHome,
      color: "text-green-600",
    },
    {
      value: "luxury_villa",
      label: "Luxury Villa",
      icon: IoStar,
      color: "text-purple-500",
    },
    {
      value: "other",
      label: "Other",
      icon: IoHelpCircle,
      color: "text-gray-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Service Name
        </label>
        <input
          id="name"
          type="text"
          {...register("name", { required: "Service name is required" })}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-rose-500 focus:border-rose-500 ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter your service name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
        {hostName && (
          <div className="mt-2 rounded-md bg-gray-50 p-3 border border-gray-200">
            <p className="text-sm text-gray-600">
              using your host name:{" "}
              <span className="font-semibold text-gray-800">{hostName}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              You can also enter your own preferred name if you'd like.
            </p>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Service Type
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {listingTypes.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setValue("type", item.value)}
                className={`p-3 border rounded-lg flex flex-col items-center transition-all ${
                  listingType === item.value
                    ? "border-rose-500 bg-rose-50 text-rose-700"
                    : "border-gray-300 hover:border-rose-300 hover:bg-rose-50"
                }`}
              >
                <Icon className={`h-6 w-6 mb-1 ${item.color}`} />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
        <input
          type="hidden"
          {...register("type", { required: "Please select a service type" })}
        />
        {errors.type && (
          <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
        )}
      </div>
    </div>
  );
};

export default NameAndListingType;
