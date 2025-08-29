import { useState } from "react";
import { format } from "date-fns";
import "./TailorAvailability.css";

const TailorAvailability = ({ availability, isShopOpen, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAvailability, setEditedAvailability] = useState(availability);
  const [editedShopOpen, setEditedShopOpen] = useState(isShopOpen);

  const handleSave = () => {
    onUpdate({
      isShopOpen: editedShopOpen,
      availability: editedAvailability,
    });
    setIsEditing(false);
  };

  const handleTimeChange = (day, field, value) => {
    setEditedAvailability((prev) =>
      prev.map((a) => (a.day === day ? { ...a, [field]: value } : a))
    );
  };

  const handleToggleDay = (day) => {
    setEditedAvailability((prev) =>
      prev.map((a) => (a.day === day ? { ...a, isOpen: !a.isOpen } : a))
    );
  };

  return (
    <div className="tailor-availability">
      <div className="availability-header">
        <h3>Shop Availability</h3>
        {isEditing ? (
          <div className="edit-actions">
            <button onClick={handleSave} className="btn btn-primary btn-sm">
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="btn btn-outline btn-sm"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-outline btn-sm"
          >
            Edit
          </button>
        )}
      </div>

      <div className="shop-status">
        <label className="status-toggle">
          <input
            type="checkbox"
            checked={editedShopOpen}
            onChange={() => setEditedShopOpen(!editedShopOpen)}
            disabled={!isEditing}
          />
          <span className="toggle-label">
            Shop is currently {editedShopOpen ? "Open" : "Closed"}
          </span>
        </label>
      </div>

      <div className="availability-grid">
        {editedAvailability.map((day) => (
          <div key={day.day} className="day-row">
            <div className="day-name">
              {day.day.charAt(0).toUpperCase() + day.day.slice(1)}
            </div>

            {isEditing ? (
              <>
                <label className="day-toggle">
                  <input
                    type="checkbox"
                    checked={day.isOpen}
                    onChange={() => handleToggleDay(day.day)}
                  />
                  <span>{day.isOpen ? "Open" : "Closed"}</span>
                </label>

                {day.isOpen && (
                  <div className="time-inputs">
                    <input
                      type="time"
                      value={day.openTime}
                      onChange={(e) =>
                        handleTimeChange(day.day, "openTime", e.target.value)
                      }
                    />
                    <span>to</span>
                    <input
                      type="time"
                      value={day.closeTime}
                      onChange={(e) =>
                        handleTimeChange(day.day, "closeTime", e.target.value)
                      }
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="day-schedule">
                {day.isOpen ? (
                  <span>
                    {format(new Date(`2000-01-01T${day.openTime}`), "h:mm a")} -
                    {format(new Date(`2000-01-01T${day.closeTime}`), "h:mm a")}
                  </span>
                ) : (
                  <span className="closed">Closed</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TailorAvailability;
