import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";
import "./GetLocationMap.css";
import { saveTailorLocation, getTailorLocation } from "../../api/tailors";

// Fix default icon issues with Leaflet in React:
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

// Search control component
function SearchField({ setSelectedPosition, setAreaName }) {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      autoComplete: true,
      autoCompleteDelay: 250,
      showMarker: false,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: true,
    });

    map.addControl(searchControl);

    map.on("geosearch/showlocation", (result) => {
      const { x, y, label } = result.location;
      const latlng = { lat: y, lng: x };
      setSelectedPosition(latlng);
      setAreaName(label);
      map.setView(latlng, 14);
    });

    return () => {
      map.removeControl(searchControl);
    };
  }, [map, setSelectedPosition, setAreaName]);

  return null;
}

// Marker for selecting location
function LocationMarker({
  selectedPosition,
  setSelectedPosition,
  setAreaName,
}) {
  useMapEvents({
    click(e) {
      setSelectedPosition(e.latlng);
      fetchAreaName(e.latlng, setAreaName);
    },
  });

  return selectedPosition === null ? null : (
    <Marker
      position={selectedPosition}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const newLatLng = e.target.getLatLng();
          setSelectedPosition(newLatLng);
          fetchAreaName(newLatLng, setAreaName);
        },
      }}
    />
  );
}

// Helper to get area name via reverse geocoding
async function fetchAreaName(latlng, setAreaName) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`
    );
    const data = await response.json();
    setAreaName(data.display_name || "Unknown area");
  } catch (err) {
    console.error("Error fetching area name:", err);
  }
}

const GetLocationMap = ({ center }) => {
  // console.log("center is : ", center);
  const [selectedPosition, setSelectedPosition] = useState({
    lat: center.lat,
    lng: center.lng,
  });
  const [areaName, setAreaName] = useState(center.area || "");
  const [saveMessage, setSaveMessage] = useState("");

  // console.log("Initial center:", center);

  const handleSaveLocation = async () => {
    const payload = {
      location: {
        lat: selectedPosition.lat,
        lng: selectedPosition.lng,
      },
      area: areaName,
    };

    // console.log("Saving location:", payload);

    try {
      await saveTailorLocation(payload);
      setSaveMessage("Location saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err) {
      console.error("Error saving location:", err);
      setSaveMessage("Failed to save location!");
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  return (
    <div className="map-wrapper">
      <MapContainer
        center={{ lat: center.lat, lng: center.lng }}
        zoom={14}
        scrollWheelZoom={true}
        className="map-container"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <SearchField
          setSelectedPosition={setSelectedPosition}
          setAreaName={setAreaName}
        />

        <LocationMarker
          selectedPosition={selectedPosition}
          setSelectedPosition={setSelectedPosition}
          setAreaName={setAreaName}
        />
      </MapContainer>

      {selectedPosition && (
        <div className="location-details">
          <h4>Selected Area:</h4>
          <p className="area-name">{areaName || "Not selected"}</p>
          <div className="coordinates">
            <span>Lat: {selectedPosition.lat.toFixed(6)}</span> &nbsp; &nbsp;
            <span>Long: {selectedPosition.lng.toFixed(6)}</span>
          </div>
        </div>
      )}

      {selectedPosition && (
        <button className="save-btn" onClick={handleSaveLocation}>
          Save Location
        </button>
      )}

      {saveMessage && <div className="save-message">{saveMessage}</div>}
    </div>
  );
};

export default GetLocationMap;
