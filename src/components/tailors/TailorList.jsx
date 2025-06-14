import { Link } from "react-router-dom";
import Loader from "../common/Loader";
import { FaUserCircle } from "react-icons/fa";
import "./TailorList.css";

const TailorList = ({ tailors, isLoading }) => {
  // console.log("TailorList component rendered with tailors:", tailors);
  if (isLoading) {
    return <Loader />;
  }

  if (tailors.length === 0) {
    return (
      <div className="no-tailors">
        <p>No tailors found. Try adjusting your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="tailor-list grid grid-cols-1 grid-cols-sm-2 grid-cols-md-3">
      {tailors.map((tailor) => (
        <div key={tailor._id} className="tailor-card card fade-in">
          <div className="tailor-card-header">
            {/* Since tailor.avatar might not exist, show a placeholder */}
            {/* <img
              src={tailor.avatar || "/default-avatar.png"}
              alt={tailor.userId?.name || "Tailor"}
              className="tailor-avatar"
            /> */}
            {tailor.avatar ? (
              <img
                src={tailor.avatar}
                alt={tailor.userId?.name || "Unknown Tailor"}
                className="tailor-avatar"
              />
            ) : (
              <FaUserCircle size={48} color="#999" className="tailor-avatar" />
            )}
            <div className="tailor-header-content">
              <h3 className="tailor-name">
                {tailor.userId?.name || "No Name"}
              </h3>
              <div className="tailor-rating">
                <span className="stars">{tailor.rating} ★</span>
                <span className="review-count">
                  ({tailor.reviewCount} reviews)
                </span>
              </div>
              {/* priceRange is not in data; you might need to adjust */}
              <div className="tailor-price-range">
                {tailor.priceRange || "N/A"}
              </div>
            </div>
          </div>

          <div className="tailor-card-body">
            <div className="tailor-services">
              {tailor.servicesOffered.slice(0, 4).map((service, index) => (
                <span key={index} className="tailor-service-tag">
                  {service}
                </span>
              ))}
              {tailor.servicesOffered.length > 4 && (
                <span className="tailor-service-tag more">
                  +{tailor.servicesOffered.length - 4} more
                </span>
              )}
            </div>

            <div className="tailor-location">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>
                {tailor.shopAddress} <br />
                {tailor.area}
              </span>
            </div>
          </div>

          <div className="tailor-card-footer">
            <Link to={`/tailor/${tailor._id}`} className="btn btn-primary">
              View Profile
            </Link>
            <Link
              to={`/order/new?tailorId=${tailor._id}`}
              className="btn btn-outline"
            >
              Book Now
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TailorList;
