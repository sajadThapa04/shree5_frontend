import {
  LoginUser,
  RegisterUser,
  VerifyEmail,
  ResendVerifyEmail,
} from "./pages/Authentication";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { NotFound } from "./components/rootindex";
import { ProtectedRoutes } from "./routes/User_Routes/index";
import MainLayout from "./components/Layouts/Mainlayout/Mainlayout";
import UserProfile from "./pages/Profile/UserProfile";
import "./App.css";
import { CreatedHost, HostProfile } from "./pages/Host/index";
import {
  EditProfile,
  CreateServices,
  CreateRestaurant,
  ServiceProfile,
  RestaurantProfile,
  ServiceProtectedRoutes,
  CreateRooms,
  RoomProfile,
  RoomProfileByRoomId,
  RoomsLandingProfile,
} from "./index";
import GuestBooking from "./pages/RoomBookings/GuestBooking/GuestBooking";
import GuestPayment from "./pages/RoomPayment/GuestRoomPayment";
import RestaurantLandingProfile from "./pages/Restaurants/Landing/RestaurantLandingProfile";
import RestaurantProfileByRestaurantId from "./pages/Restaurants/Landing/RestaurantProfileByRestaurantId";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "login",
          element: <LoginUser />,
        },
        {
          path: "register",
          element: <RegisterUser />,
        },
        {
          index: true,
          element: <RoomsLandingProfile />,
        },
        {
          path: "/rooms/:roomId",
          element: <RoomProfileByRoomId />,
        },
        {
          path: "restaurants",
          element: <RestaurantLandingProfile />,
        },
        {
          path: "/restaurants/:restaurantId",
          element: <RestaurantProfileByRestaurantId />,
        },
        {
          path: "/room/:roomId/bookings",
          element: <GuestBooking />,
        },
        {
          path: "/payment/:bookingId",
          element: <GuestPayment />,
        },
      ],
    },
    // Authentication routes outside main layout
    {
      path: "/verify-email",
      element: <VerifyEmail />,
    },
    {
      path: "/resend-verification",
      element: <ResendVerifyEmail />,
    },
    {
      element: <ProtectedRoutes />, // This wraps all protected children
      children: [
        {
          path: "/dashboard",
          element: <UserProfile />,
        },
        {
          path: "/create_host",
          element: <CreatedHost />,
        },
        {
          element: <ServiceProtectedRoutes />, // This wraps service-related routes
          children: [
            {
              path: "/create_service",
              element: <CreateServices />,
            },
            {
              path: "/create_restaurant",
              element: <CreateRestaurant />,
            },
            //for accomodation types like hotels lodges luxury villas and home stays we are using the same component
            {
              path: "/create_rooms",
              element: <CreateRooms />,
            },
            // Add other service-related routes that require active host status
          ],
        },
        {
          path: "/host/:hostId/services",
          element: <ServiceProfile />,
        },
        {
          path: "/services/:serviceId/restaurants",
          element: <RestaurantProfile />,
        },
        {
          path: "/services/:serviceId/rooms",
          element: <RoomProfile />,
        },
        {
          path: "/host/user/:userId",
          element: <HostProfile />,
        },
        {
          path: "/host/user/:userId/edit",
          element: <EditProfile />,
        },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
