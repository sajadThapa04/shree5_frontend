import React from "react";
import { useNavigate } from "react-router-dom";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Button } from "../Ui";
function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
        </div>

        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          404 - Page Not Found
        </h1>

        <p className="mt-2 text-gray-600">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="mt-6 flex flex-col space-y-3">
          <Button
            onClick={() => navigate(-1)}
            variant="secondary"
            className="w-full"
          >
            Go Back
          </Button>

          <Button onClick={() => navigate("/")} className="w-full">
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
