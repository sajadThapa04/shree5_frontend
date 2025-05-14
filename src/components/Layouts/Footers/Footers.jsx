import { Link } from "react-router-dom";
import {
  HomeModernIcon,
  BuildingStorefrontIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  UserIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center group">
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

            <p className="mt-4 text-sm text-gray-600 transition-all duration-300 hover:text-gray-800 hover:scale-[1.01]">
              Discover the best stays, restaurants, and experiences for your
              perfect getaway.
            </p>

            <div className="mt-4 flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-rose-500 transition-colors duration-300"
              >
                <FaFacebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-rose-500 transition-colors duration-300"
              >
                <FaInstagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-rose-500 transition-colors duration-300"
              >
                <FaTiktok className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  to="/stays"
                  className="flex items-center text-sm text-gray-600 hover:text-rose-500 transition-colors"
                >
                  <HomeModernIcon className="h-4 w-4 mr-2" />
                  Stays
                </Link>
              </li>
              <li>
                <Link
                  to="/restaurants"
                  className="flex items-center text-sm text-gray-600 hover:text-rose-500 transition-colors"
                >
                  <BuildingStorefrontIcon className="h-4 w-4 mr-2" />
                  Restaurants
                </Link>
              </li>
              <li>
                <Link
                  to="/experiences"
                  className="flex items-center text-sm text-gray-600 hover:text-rose-500 transition-colors"
                >
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  Experiences
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="flex items-center text-sm text-gray-600 hover:text-rose-500 transition-colors"
                >
                  <UserIcon className="h-4 w-4 mr-2" />
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Support
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  to="/contact"
                  className="flex items-center text-sm text-gray-600 hover:text-rose-500 transition-colors"
                >
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="flex items-center text-sm text-gray-600 hover:text-rose-500 transition-colors"
                >
                  <QuestionMarkCircleIcon className="h-4 w-4 mr-2" />
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="flex items-center text-sm text-gray-600 hover:text-rose-500 transition-colors"
                >
                  <ShieldCheckIcon className="h-4 w-4 mr-2" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="flex items-center text-sm text-gray-600 hover:text-rose-500 transition-colors"
                >
                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Contact Us
            </h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-start">
                <EnvelopeIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                <span className="ml-3 text-sm text-gray-600">
                  contact@shree5.com
                </span>
              </div>
              <div className="flex items-start">
                <PhoneIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                <span className="ml-3 text-sm text-gray-600">
                  +1 (555) 123-4567
                </span>
              </div>
              <div className="flex items-start">
                <GlobeAltIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                <span className="ml-3 text-sm text-gray-600">
                  www.shree5.com
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="mt-8 md:mt-0 text-center md:text-right">
              <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} shree5, Inc. All rights
                reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
