import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../api/auth";
import { updateTailorProfile } from "../api/tailors";
import TailorAvailability from "../components/tailors/TailorAvailability";
import "./Profile.css";

const defaultAvailability = [
  { day: "monday", isOpen: false, openTime: "09:00", closeTime: "18:00" },
  { day: "tuesday", isOpen: false, openTime: "09:00", closeTime: "18:00" },
  { day: "wednesday", isOpen: false, openTime: "09:00", closeTime: "18:00" },
  { day: "thursday", isOpen: false, openTime: "09:00", closeTime: "18:00" },
  { day: "friday", isOpen: false, openTime: "09:00", closeTime: "18:00" },
  { day: "saturday", isOpen: false, openTime: "09:00", closeTime: "18:00" },
  { day: "sunday", isOpen: false, openTime: "09:00", closeTime: "18:00" },
];

const Profile = () => {
  const { currentUser, isTailor } = useAuth();
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    address: currentUser?.address || "",
    shopAddress: currentUser?.shopAddress || "",
    servicesOffered: currentUser?.servicesOffered?.join(", ") || "",
    priceRange: currentUser?.priceRange || "",
    maxOrdersPerDay: currentUser?.maxOrdersPerDay || 10,
    isShopOpen: currentUser?.isShopOpen || true,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing) return; // Do nothing if not in edit mode

    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const userData = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      };

      await updateProfile(userData);

      if (isTailor) {
        const tailorData = {
          shopAddress: formData.shopAddress,
          servicesOffered: formData.servicesOffered
            .split(",")
            .map((s) => s.trim()),
          priceRange: formData.priceRange,
          maxOrdersPerDay: parseInt(formData.maxOrdersPerDay),
          isShopOpen: formData.isShopOpen,
        };
        await updateTailorProfile(tailorData);
      }

      setSuccess("Profile updated successfully");
      setIsEditing(false);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = () => {
    // Reset form data to current user data
    setFormData({
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      phone: currentUser?.phone || "",
      address: currentUser?.address || "",
      shopAddress: currentUser?.shopAddress || "",
      servicesOffered: currentUser?.servicesOffered?.join(", ") || "",
      priceRange: currentUser?.priceRange || "",
      maxOrdersPerDay: currentUser?.maxOrdersPerDay || 10,
      isShopOpen: currentUser?.isShopOpen || true,
    });
    setIsEditing(true);
    setSuccess(null);
    setError(null);
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>Profile Settings</h1>

        {error && (
          <div className="alert alert-error" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success" role="alert">
            {success}
          </div>
        )}

        {/* 🟡 FORM */}
        <div className="profile-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                disabled
                className="disabled"
              />
              <small>Email cannot be changed</small>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">
                {isTailor ? "Personal Address" : "Address"}
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
            </div>

            {isTailor && (
              <>
                <div className="form-group">
                  <label htmlFor="shopAddress">Shop Address</label>
                  <input
                    type="text"
                    id="shopAddress"
                    name="shopAddress"
                    value={formData.shopAddress}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="servicesOffered">
                    Services Offered (comma separated)
                  </label>
                  <input
                    type="text"
                    id="servicesOffered"
                    name="servicesOffered"
                    value={formData.servicesOffered}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="priceRange">Price Range</label>
                  <input
                    type="text"
                    id="priceRange"
                    name="priceRange"
                    value={formData.priceRange}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="e.g., ₹500-2000"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="maxOrdersPerDay">
                    Maximum Orders Per Day
                  </label>
                  <input
                    type="number"
                    id="maxOrdersPerDay"
                    name="maxOrdersPerDay"
                    value={formData.maxOrdersPerDay}
                    onChange={handleChange}
                    disabled={!isEditing}
                    min="1"
                    required
                  />
                </div>

                <div className="form-group form-checkbox">
                  <label htmlFor="isShopOpen">
                    <input
                      type="checkbox"
                      id="isShopOpen"
                      name="isShopOpen"
                      checked={formData.isShopOpen}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    Shop is currently open for orders
                  </label>
                </div>
              </>
            )}

            {isEditing && (
              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            )}
          </form>

          {/* 🟡 Edit Profile button OUTSIDE the form to prevent accidental submit */}
          {!isEditing && (
            <div className="edit-profile-btn">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleEditProfile}
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>

        {isTailor && (
          <div className="availability-section">
            <TailorAvailability
              availability={currentUser?.availability || defaultAvailability}
              //   availability={currentUser?.availability?.length ? currentUser.availability : defaultAvailability}
              isShopOpen={currentUser?.isShopOpen}
              onUpdate={async (data) => {
                try {
                  await updateTailorProfile(data);
                  setSuccess("Availability updated successfully");
                } catch (err) {
                  setError(err.message || "Failed to update availability");
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
