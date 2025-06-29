// CombinedLanding.js
import RoomsLandingProfile from "./pages/Rooms/Landing/RoomsLandingProfile";
import RestaurantLandingProfile from "./pages/Restaurants/Landing/RestaurantLandingProfile";
const CombinedLanding = () => {
  return (
    <div>
      <RoomsLandingProfile />
      <RestaurantLandingProfile />
    </div>
  );
};

export default CombinedLanding;