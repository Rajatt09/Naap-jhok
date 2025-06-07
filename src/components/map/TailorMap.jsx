import { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Link } from 'react-router-dom';
import './TailorMap.css';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const TailorMap = ({ tailors, center, onRadiusChange }) => {
  const [selectedTailor, setSelectedTailor] = useState(null);
  const [radius, setRadius] = useState(4);

  const handleRadiusChange = (event) => {
    const newRadius = parseInt(event.target.value);
    setRadius(newRadius);
    onRadiusChange(newRadius);
  };

  const handleMarkerClick = useCallback((tailor) => {
    setSelectedTailor(tailor);
  }, []);

  return (
    <div className="tailor-map-container">
      <div className="map-controls">
        <select 
          value={radius} 
          onChange={handleRadiusChange}
          className="radius-select"
        >
          <option value="1">1 km</option>
          <option value="2">2 km</option>
          <option value="4">4 km</option>
          <option value="5">5 km</option>
        </select>
      </div>

      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={14}
        >
          {tailors.map((tailor) => (
            <Marker
              key={tailor._id}
              position={tailor.location}
              onClick={() => handleMarkerClick(tailor)}
            />
          ))}

          {selectedTailor && (
            <InfoWindow
              position={selectedTailor.location}
              onCloseClick={() => setSelectedTailor(null)}
            >
              <div className="tailor-info-window">
                <h3>{selectedTailor.name}</h3>
                <p>{selectedTailor.shopAddress}</p>
                <p>Rating: {selectedTailor.rating} ★</p>
                <Link 
                  to={`/tailor/${selectedTailor._id}`}
                  className="btn btn-primary btn-sm"
                >
                  View Profile
                </Link>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default TailorMap;