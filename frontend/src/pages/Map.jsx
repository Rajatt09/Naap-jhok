import React, { useState, useEffect } from "react";
import "./Map.css";
import GetLocationMap from "../components/map/GetLocationMap";
import { getUserLocation } from "../api/locations";
import { getTailorLocation } from "../api/tailors";

const Map = () => {
  const [center, setCenter] = useState({ lat: 28.6139, lng: 77.209 }); // Default center
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initLocation = async () => {
      try {
        const tailorLocation = await getTailorLocation();
        // console.log("Tailor Location:", tailorLocation);

        if (tailorLocation?.location?.lat && tailorLocation?.location?.lng) {
          setCenter({
            lat: tailorLocation.location.lat,
            lng: tailorLocation.location.lng,
            area: tailorLocation.area,
          });
        } else {
          const userLocation = await getUserLocation();
          setCenter({ lat: userLocation.lat, lng: userLocation.lng });
        }
      } catch (error) {
        console.error("Error getting location:", error.message);

        try {
          const userLocation = await getUserLocation();
          setCenter({ lat: userLocation.lat, lng: userLocation.lng });
        } catch (userError) {
          console.error("Error getting user's location:", userError.message);
        }
      } finally {
        setLoading(false);
      }
    };

    initLocation();
  }, []);

  if (loading) {
    return <p>Loading map...</p>;
  }

  return (
    <div>
      <GetLocationMap center={center} />
    </div>
  );
};

export default Map;
