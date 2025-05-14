// src/store/rootReducer.js
import {combineReducers} from "redux";
import userReducer from "../Slices/userSlices";
import hostReducer from "../Slices/hostSlice";
import serviceReducer from "../Slices/serviceSlice";
import restaurantReducer from "../Slices/restaurantSlice";
import roomReducer from "../Slices/roomSlice";

const rootReducer = combineReducers({
  user: userReducer, host: hostReducer, services: serviceReducer, restaurants: restaurantReducer, rooms: roomReducer
  // Add other reducers here as your app grows
});

export default rootReducer;