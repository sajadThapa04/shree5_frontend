import React, { useState, useEffect } from "react";
import { useUpdateUserAddress } from "../../../hooks/userApiHooks/useAddAddress";
import { Card } from "../../Ui";
import {
  MapPinIcon,
  HomeIcon,
  BuildingOfficeIcon,
  GlobeAmericasIcon,
} from "@heroicons/react/24/outline";
import { Button } from "../../Ui";

function AddAddress({ initialAddress = {} }) {
  const [formData, setFormData] = useState({
    country: "",
    city: "",
    street: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: updateAddress, isLoading } = useUpdateUserAddress();

  // Initialize form data when initialAddress changes
  useEffect(() => {
    setFormData({
      country: initialAddress.country || "",
      city: initialAddress.city || "",
      street: initialAddress.street || "",
    });
  }, [initialAddress.country, initialAddress.city, initialAddress.street]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Only submit if all required fields have values
    if (formData.country && formData.city && formData.street) {
      updateAddress(formData, {
        onSuccess: () => {
          setIsEditing(false);
        },
      });
    }
  };

  return (
    <Card className="p-6 bg-white rounded-lg shadow-md mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <MapPinIcon className="h-5 w-5 text-rose-600" />
          Address Information
        </h2>
        {!isEditing && (
          <Button
            variant="ghost"
            onClick={() => setIsEditing(true)}
            className="text-rose-600 hover:bg-rose-50"
          >
            {initialAddress.country ? "Edit Address" : "Add Address"}
          </Button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <GlobeAmericasIcon className="h-5 w-5 text-gray-400 mt-2 flex-shrink-0" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country*
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                  placeholder="Enter your country"
                  required
                />
              </div>
            </div>

            <div className="flex items-start gap-3">
              <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mt-2 flex-shrink-0" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City*
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                  placeholder="Enter your city"
                  required
                />
              </div>
            </div>

            <div className="flex items-start gap-3">
              <HomeIcon className="h-5 w-5 text-gray-400 mt-2 flex-shrink-0" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address*
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                  placeholder="Enter your street address"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setIsEditing(false)}
              disabled={isLoading}
              type="button"  // Important to prevent form submission
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isLoading || !formData.country || !formData.city || !formData.street}
              isLoading={isLoading}
            >
              {initialAddress.country ? "Update Address" : "Save Address"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {initialAddress.country || initialAddress.city || initialAddress.street ? (
            <>
              {initialAddress.country && (
                <div className="flex items-start">
                  <GlobeAmericasIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-500 uppercase">
                      Country
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {initialAddress.country}
                    </p>
                  </div>
                </div>
              )}
              {initialAddress.city && (
                <div className="flex items-start">
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-500 uppercase">
                      City
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {initialAddress.city}
                    </p>
                  </div>
                </div>
              )}
              {initialAddress.street && (
                <div className="flex items-start">
                  <HomeIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-500 uppercase">
                      Street Address
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {initialAddress.street}
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No address information added yet
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

export default AddAddress;