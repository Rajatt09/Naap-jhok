import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getTailorById } from "../api/tailors";
import Loader from "../components/common/Loader";
import { FaUserCircle, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import "./TailorProfile.css";

const TailorProfile = () => {
  const { id } = useParams();
  const [tailor, setTailor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTailor = async () => {
      try {
        setIsLoading(true);
        const tailorData = await getTailorById(id);
        setTailor(tailorData);
      } catch (err) {
        setError(err.message || "Failed to load tailor profile");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTailor();
  }, [id]);

  if (isLoading) return <Loader />;
  if (error || !tailor)
    return (
      <div className="error-container">
        <p>{error || "Tailor not found"}</p>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    );

  const {
    userId,
    shopAddress,
    area,
    location,
    servicesOffered,
    rating,
    reviewCount,
    avatar,
    shopImages,
    priceRange,
    isShopOpen,
    availability,
  } = tailor;

  return (
    <div className="tailor-profile-page container">
      <div className="back-link">
        <Link to="/">&larr; Back to Home</Link>
      </div>

      <div className="profile-header">
        <div className="profile-header-content">
          <div className="tailor-profile-avatar">
            {avatar ? (
              <img src={avatar} alt={userId?.name || "Tailor"} />
            ) : (
              <FaUserCircle size={80} color="#ccc" />
            )}
          </div>
          <div className="tailor-profile-info">
            <h1>{userId?.name || "Unknown Tailor"}</h1>
            <div className="tailor-rating-container">
              <span className="stars">{rating} ★</span>
              <span className="review-count">({reviewCount} reviews)</span>
              {priceRange && (
                <span className="tailor-price-range">{priceRange}</span>
              )}
              <span className={`shop-status ${isShopOpen ? "open" : "closed"}`}>
                {isShopOpen ? "Open Now" : "Closed"}
              </span>
            </div>
            <div className="tailor-location">
              <FaMapMarkerAlt />{" "}
              <span>
                {shopAddress} <br /> {area}
              </span>
            </div>
            <div className="tailor-contact">
              <FaPhoneAlt /> <span>{userId?.phone || "N/A"}</span>
            </div>
            <Link
              to={`/order/new?tailorId=${tailor._id}`}
              className="btn btn-primary book-btn"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <section className="tailor-services-section">
          <h2>Services Offered</h2>
          {servicesOffered.length ? (
            <div className="services-grid">
              {servicesOffered.map((service, idx) => (
                <div key={idx} className="service-item">
                  ✂️ {service}
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-text">No services listed</p>
          )}
        </section>

        <section className="tailor-gallery-section">
          <h2>Shop Gallery</h2>
          {shopImages.length ? (
            <div className="shop-gallery">
              {shopImages.map((image, idx) => (
                <div key={idx} className="gallery-image">
                  <img src={image} alt={`shop image ${idx + 1}`} />
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-text">No shop images uploaded</p>
          )}
        </section>

        <section className="tailor-availability-section">
          <h2>Availability</h2>
          {availability.length ? (
            <div className="availability-table">
              {availability.map((slot, idx) => (
                <div key={idx} className="availability-row">
                  <span className="day">{slot.day}</span>
                  <span className="hours">
                    {slot.isOpen
                      ? `${slot.openTime || "N/A"} - ${slot.closeTime || "N/A"}`
                      : "Closed"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-text">No availability data provided</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default TailorProfile;
