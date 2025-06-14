import { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import "./TailorMap.css";
import { getAllTailors } from "../../api/tailors";
import { getUserLocation } from "../../api/locations";
import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";
import { Link } from "react-router-dom";

// Fix Leaflet icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

function SearchControl() {
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
    return () => map.removeControl(searchControl);
  }, [map]);
  return null;
}

function CenterMap({ query }) {
  const map = useMap();
  useEffect(() => {
    if (!query) return;
    const fetchCenter = async () => {
      try {
        const resp = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
        );
        const results = await resp.json();
        if (results[0]) {
          const { lat, lon } = results[0];
          map.setView([+lat, +lon], 13);
        }
      } catch (e) {
        console.error("Search region failed", e);
      }
    };
    fetchCenter();
  }, [query, map]);
  return null;
}

function distance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const TailorMap = () => {
  const [userLoc, setUserLoc] = useState(null);
  const [tailors, setTailors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [radius, setRadius] = useState(0);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef();

  useEffect(() => {
    (async () => {
      try {
        const u = await getUserLocation();
        setUserLoc(u);
        const t = await getAllTailors();
        setTailors(t);
        setFiltered(t);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!userLoc) return;
    if (radius === 0) return setFiltered(tailors);
    const f = tailors.filter(
      (t) =>
        distance(userLoc.lat, userLoc.lng, t.location.lat, t.location.lng) <=
        radius
    );
    setFiltered(f);
  }, [radius, tailors, userLoc]);

  if (loading) return <div className="mp-loading">Loading map...</div>;

  return (
    <div className="mp-wrapper">
      <div className="mp-header">
        {/* Current Location Display */}
        <div className="mp-location-info">
          <div className="mp-location-icon">📍</div>
          <div className="mp-location-details">
            <span className="mp-location-label">Your Location</span>
            <span className="mp-coordinates">
              {userLoc
                ? `${userLoc.lat.toFixed(4)}, ${userLoc.lng.toFixed(4)}`
                : "Loading..."}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="mp-controls">
          <div className="mp-control-group">
            <label htmlFor="radius-select" className="mp-control-label">
              🎯 Search Range:
            </label>
            <select
              id="radius-select"
              className="mp-select"
              value={radius}
              onChange={(e) => setRadius(+e.target.value)}
            >
              <option value={0}>All Tailors</option>
              <option value={2}>2 km</option>
              <option value={5}>5 km</option>
              <option value={10}>10 km</option>
              <option value={15}>15 km</option>
            </select>
          </div>

          <div className="mp-tailor-count">
            👥 {filtered.length} tailors found
          </div>
        </div>
      </div>

      <MapContainer
        center={userLoc}
        zoom={13}
        scrollWheelZoom
        className="mp-map-container"
        whenCreated={(map) => (mapRef.current = map)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OSM contributors"
        />

        <SearchControl />

        {radius > 0 && (
          <Circle
            center={userLoc}
            radius={radius * 1000}
            pathOptions={{
              color: "#4f46e5",
              fillColor: "#4f46e5",
              fillOpacity: 0.1,
              weight: 2,
            }}
          />
        )}

        <Marker
          position={userLoc}
          icon={L.divIcon({
            className: "mp-user-marker",
            iconSize: [16, 16],
            html: '<div class="mp-user-marker-inner"></div>',
          })}
        />

        {filtered.map((t) => (
          <Marker
            key={t._id}
            position={t.location}
            eventHandlers={{
              click: () => {
                mapRef.current.setView(t.location, 15, { animate: true });
              },
            }}
          >
            <Popup className="mp-popup" maxWidth={200} minWidth={180}>
              <div className="mp-popup-body">
                <div className="mp-popup-header">
                  <img src={t.avatar} className="mp-popup-img" alt="Tailor" />
                  <div className="mp-popup-info">
                    <h5 className="mp-popup-name">{t.userId.name}</h5>
                    {/* <p className="mp-popup-area">📍 {t.area}</p> */}
                  </div>
                </div>
                <div className="mp-popup-services">
                  <span className="mp-services-label">
                    {t.area} <br />
                  </span>
                  <h4>Services:</h4>
                  <div className="mp-services-tags">
                    {t.servicesOffered.slice(0, 2).map((service, index) => (
                      <span key={index} className="mp-service-tag">
                        {service}
                      </span>
                    ))}
                    {t.servicesOffered.length > 2 && (
                      <span className="mp-service-tag mp-more-tag">
                        +{t.servicesOffered.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
                <Link to={`/tailor/${t._id}`}>
                  <button className="mp-popup-btn">Place Order</button>
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default TailorMap;
