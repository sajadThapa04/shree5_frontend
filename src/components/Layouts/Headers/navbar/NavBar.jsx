import { Link, NavLink } from "react-router-dom";
import {
  HomeModernIcon,
  BuildingStorefrontIcon,
  MapPinIcon,
  UserIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  HomeIcon, // Added for the host link
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { Button } from "../../../Ui/index";

const NavBar = ({
  user = null,
  onLogout = () => {},
  hasActiveHost = false,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and mobile menu button */}
          <div className="flex items-center">
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
            <Link to="/" className="flex items-center ml-4 md:ml-0 group">
              <span className="text-2xl font-extrabold text-gray-900 group-hover:text-rose-600 transition-colors duration-300">
                <span className="inline-block group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">
                  s
                </span>
                <span className="inline-block group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                  h
                </span>
                <span className="inline-block group-hover:scale-110 transition-transform duration-300">
                  r
                </span>
                <span className="inline-block group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  e
                </span>
                <span className="inline-block group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  e
                </span>
                <span className="text-rose-600 group-hover:text-gray-900 transition-colors duration-300">
                  5
                </span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
            <NavLink
              to="/stays"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-rose-50 text-rose-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-rose-500"
                }`
              }
            >
              <HomeModernIcon className="h-5 w-5 mr-2" />
              Stays
            </NavLink>
            <NavLink
              to="/restaurants"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-rose-50 text-rose-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-rose-500"
                }`
              }
            >
              <BuildingStorefrontIcon className="h-5 w-5 mr-2" />
              Restaurants
            </NavLink>
            <NavLink
              to="/experiences"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-rose-50 text-rose-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-rose-500"
                }`
              }
            >
              <MapPinIcon className="h-5 w-5 mr-2" />
              Experiences
            </NavLink>

            {/* Become a Host link - only shown when user is logged in */}
            {user && (
              <Link
                to={hasActiveHost ? "/create_service" : "/create_host"}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-rose-600 border border-rose-200 hover:bg-rose-50 hover:text-rose-700 transition-colors"
              >
                <HomeIcon className="h-5 w-5 mr-2" />
                {hasActiveHost ? "Create a Service" : "Become a Host"}
              </Link>
            )}

            <button className="p-2 rounded-full text-gray-500 hover:text-rose-500 hover:bg-gray-50">
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>

            {user ? (
              <div className="relative ml-2">
                <button
                  className="flex items-center space-x-1 focus:outline-none"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                    {user.fullName ? (
                      <span className="text-rose-600 font-medium text-sm">
                        {user.fullName.charAt(0).toUpperCase()}
                      </span>
                    ) : (
                      <UserIcon className="h-5 w-5 text-rose-600" />
                    )}
                  </div>
                  <ChevronDownIcon
                    className={`h-4 w-4 text-gray-500 transition-transform ${
                      isUserMenuOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </button>

                {isUserMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                    onMouseLeave={() => setIsUserMenuOpen(false)}
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user.fullName || "User"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user.role === "host" ? "Host" : "Traveler"}
                      </p>
                    </div>
                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <UserIcon className="h-4 w-4 mr-3 text-gray-400" />
                      Profile
                    </Link>
                    {user.role === "host" && (
                      <Link
                        to="/host"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <HomeModernIcon className="h-4 w-4 mr-3 text-gray-400" />
                        Host Panel
                      </Link>
                    )}
                    <Link
                      to="/bookings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <MapPinIcon className="h-4 w-4 mr-3 text-gray-400" />
                      My Bookings
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => {
                        onLogout();
                        setIsUserMenuOpen(false);
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <XMarkIcon className="h-4 w-4 mr-3 text-gray-400" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3 ml-2">
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-rose-500 hover:bg-gray-50"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 shadow-sm"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "max-h-screen opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 bg-white shadow-lg">
          <NavLink
            to="/stays"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md text-base font-medium ${
                isActive
                  ? "bg-rose-50 text-rose-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-rose-500"
              }`
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <HomeModernIcon className="h-5 w-5 mr-3" />
            Stays
          </NavLink>
          <NavLink
            to="/restaurants"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md text-base font-medium ${
                isActive
                  ? "bg-rose-50 text-rose-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-rose-500"
              }`
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <BuildingStorefrontIcon className="h-5 w-5 mr-3" />
            Restaurants
          </NavLink>
          <NavLink
            to="/experiences"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md text-base font-medium ${
                isActive
                  ? "bg-rose-50 text-rose-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-rose-500"
              }`
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <MapPinIcon className="h-5 w-5 mr-3" />
            Experiences
          </NavLink>

          {/* Mobile Become a Host link */}
          {user && (
            <Link
              to={hasActiveHost ? "/create_service" : "/create_host"}
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-rose-600 border border-rose-200 hover:bg-rose-50 hover:text-rose-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <HomeIcon className="h-5 w-5 mr-3" />
              {hasActiveHost ? "Create a Service" : "Become a Host"}
            </Link>
          )}
          
          <div className="pt-4 border-t border-gray-200">
            {user ? (
              <>
                <div className="flex items-center px-3 py-2">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                      {user.fullName ? (
                        <span className="text-rose-600 font-medium">
                          {user.fullName.charAt(0).toUpperCase()}
                        </span>
                      ) : (
                        <UserIcon className="h-5 w-5 text-rose-600" />
                      )}
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      {user.fullName || "User"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.role === "host" ? "Host" : "Traveler"}
                    </div>
                  </div>
                </div>
                <Link
                  to="/dashboard"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-rose-500"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <UserIcon className="h-5 w-5 mr-3" />
                  Dashboard
                </Link>
                {user.role === "host" && (
                  <Link
                    to="/host"
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-rose-500"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <HomeModernIcon className="h-5 w-5 mr-3" />
                    Host Panel
                  </Link>
                )}
                <Link
                  to="/bookings"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-rose-500"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <MapPinIcon className="h-5 w-5 mr-3" />
                  My Bookings
                </Link>
                <button
                  onClick={() => {
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-rose-500"
                >
                  <XMarkIcon className="h-5 w-5 mr-3" />
                  Sign out
                </button>
              </>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center px-4 py-2 rounded-md text-base font-medium text-white bg-rose-600 hover:bg-rose-700 shadow-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
                <p className="text-center text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-rose-600 hover:text-rose-500"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
