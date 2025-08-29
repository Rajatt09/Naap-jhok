import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TailorList from "../components/tailors/TailorList";
import { getNearbyTailors, getAllTailors } from "../api/tailors";
import { getUserLocation } from "../api/locations";
import "./Home.css";

export function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRadians = (degree) => (degree * Math.PI) / 180;
  const R = 6371; // Earth radius in kilometers

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in kilometers
}

const Home = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [nearbyTailors, setNearbyTailors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);
  const [allTailors, setAllTailors] = useState([]);
  const [displayedTailors, setDisplayedTailors] = useState([]);
  const [searchRange, setSearchRange] = useState("");

  useEffect(() => {
    const fetchTailors = async () => {
      try {
        setIsLoading(true);
        let tailors = [];

        if (searchRange) {
          const { lat: userLat, lng: userLng } = await getUserLocation();
          console.log("User Location (fetched):", userLat, userLng);

          const all = await getAllTailors();

          tailors = all.filter((tailor) => {
            if (!tailor.location?.lat || !tailor.location?.lng) return false;
            const distance = calculateDistance(
              userLat,
              userLng,
              tailor.location.lat,
              tailor.location.lng
            );
            return distance <= Number(searchRange);
          });
        } else {
          tailors = await getAllTailors();
        }

        console.log("tailors are : ", tailors);

        setAllTailors(tailors);
        setDisplayedTailors(tailors.slice(0, visibleCount));
      } catch (error) {
        console.error("Error fetching tailors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTailors();
  }, [searchRange]);

  // Filter functionality
  const filteredTailors = displayedTailors.filter(
    (tailor) =>
      tailor.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tailor.shopAddress?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tailor.servicesOffered.some((service) =>
        service.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const handleViewMore = () => {
    setVisibleCount((prev) => prev + 6); // Load 6 more tailors each click
  };

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          {currentUser?.role != "tailor" ? (
            <h1 className="slide-up">Find the Perfect Tailor Near You</h1>
          ) : (
            <h1 className="slide-up">Grow Your Tailoring Business</h1>
          )}
          {currentUser?.role != "tailor" ? (
            <p className="slide-up">
              Quality stitching, custom fits, and convenient delivery options
            </p>
          ) : (
            <p className="slide-up">
              Manage orders, connect with customers, and streamline your
              workflow
            </p>
          )}

          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary slide-up">
              Go to Dashboard
            </Link>
          ) : (
            <div className="hero-buttons slide-up">
              <Link to="/login" className="btn btn-primary">
                Get Started
              </Link>
              {/* <Link to="/signup" className="btn btn-outline">
                Join as Tailor
              </Link> */}
            </div>
          )}
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2>How It Works</h2>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Tailors Near you</h3>
              <p>
                Stitch clothes with skilled tailors within 4km of your location
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">✂️</div>
              <h3>Place Order</h3>
              <p>Share your measurements and clothing requirements</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">👕</div>
              <h3>Get Stitched</h3>
              <p>Tailors work on your order with quality craftsmanship</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Delivery Options</h3>
              <p>Choose between pickup or home delivery</p>
            </div>
          </div>
        </div>
      </section>
      {/* 
      {currentUser?.role != "tailor" && (
        <section className="nearby-tailors-section">
          <div className="container">
            <div className="section-header">
              <h2>Tailors Near You</h2>

              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search by name or service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />

                <div className="search-divider">OR</div>

                <label htmlFor="range-select" className="range-label">
                  Search Nearby:
                </label>
                <select
                  id="range-select"
                  value={searchRange}
                  onChange={(e) => setSearchRange(e.target.value)}
                  className="range-select"
                >
                  <option value="">Select Range</option>
                  <option value="2">2 km</option>
                  <option value="4">4 km</option>
                  <option value="8">8 km</option>
                  <option value="10">10 km</option>
                </select>
              </div>
            </div>

            <TailorList tailors={filteredTailors} isLoading={isLoading} />

            <div className="view-all-container">
              {visibleCount < allTailors.length && (
                <Link onClick={handleViewMore} className="btn btn-outline">
                  View More
                </Link>
              )}
              <Link to="/tailors_in_range" className="btn btn-outline">
                View Tailors on map
              </Link>
            </div>
          </div>
        </section>
      )} */}

      <section className="testimonials-section">
        <div className="container">
          <h2>What Our Users Say</h2>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-rating">★★★★★</div>
              <p>
                "Found an amazing tailor who made the perfect wedding outfit for
                me. The process was so smooth!"
              </p>
              <div className="testimonial-author">- Priya S.</div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-rating">★★★★★</div>
              <p>
                "As a tailor, this platform has helped me reach more customers.
                My business has grown significantly!"
              </p>
              <div className="testimonial-author">
                - Raj M., Professional Tailor
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-rating">★★★★☆</div>
              <p>
                "Great service, love the order tracking. Being able to choose
                delivery options is very convenient."
              </p>
              <div className="testimonial-author">- Aisha K.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of users finding the perfect fit</p>

          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </Link>
          ) : (
            <div className="cta-buttons">
              <Link to="/signup" className="btn btn-primary">
                Sign Up Now
              </Link>
              <Link to="/login" className="btn btn-outline">
                Log In
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
