import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import SignInPage from "./pages/auth/signin/SignInPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import Stays from "./pages/stays/Stays";
import Flights from "./pages/flights/Flights";
import FlightsHotels from "./pages/flights-hotels/FlightsHotels";
import CarRentals from "./pages/car-rentals/CarRentals";
import Attractions from "./pages/attractions/Attractions";
import AirportTaxis from "./pages/airport-taxis/AirportTaxis";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Authentication Routes */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Dashboard with nested routes */}
          <Route path="/" element={<Dashboard />}>
            <Route index element={<Stays />} />
            <Route path="stays" element={<Stays />} />
            <Route path="flights" element={<Flights />} />
            <Route path="flights-hotels" element={<FlightsHotels />} />
            <Route path="car-rentals" element={<CarRentals />} />
            <Route path="attractions" element={<Attractions />} />
            <Route path="airport-taxis" element={<AirportTaxis />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
