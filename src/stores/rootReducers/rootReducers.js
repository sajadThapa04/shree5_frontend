// src/store/rootReducer.js
import {combineReducers} from "redux";
import userReducer from "../Slices/userSlices";
import hostReducer from "../Slices/hostSlice";
import serviceReducer from "../Slices/serviceSlice";
import restaurantReducer from "../Slices/restaurantSlice";
import roomReducer from "../Slices/roomSlice";
import bookingReducer from "../Slices/roomBookingSlice";
import roomPaymentReducer from "../Slices/roomPaymentSlice"; // Make sure this import is correct

const rootReducer = combineReducers({
  user: userReducer,
  host: hostReducer,
  services: serviceReducer,
  restaurants: restaurantReducer,
  rooms: roomReducer,
  bookings: bookingReducer,
  roomPayments: roomPaymentReducer // This key must match what selectors expect
});

export default rootReducer;