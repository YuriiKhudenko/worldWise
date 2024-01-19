import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import { useCitiesContext } from "../contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import { useUrlPosition } from "../hooks/useUrlPosition";

import Button from "./Button";

import styles from "./Map.module.css";

const HOT_URL = "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png";
// const ORIGINAL_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

const RecenterAutomatically = ({ mapPosition }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([mapPosition[0], mapPosition[1]]);
  }, [mapPosition, map]);
  return null;
};

const DetectClick = () => {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });

  return null;
};

function Map() {
  const { cities } = useCitiesContext();
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const {
    isLoading: isPositionLoading,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation();
  const { mapLat, mapLng } = useUrlPosition();

  useEffect(() => {
    if (geolocationPosition) {
      setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
    }
  }, [geolocationPosition]);

  useEffect(() => {
    if (mapLat && mapLng) {
      setMapPosition([mapLat, mapLng]);
    }
  }, [mapLat, mapLng]);

  return (
    <div className={styles.mapContainer}>
      {!geolocationPosition && (
        <Button type="position" onClick={getPosition}>
          {isPositionLoading ? "Loading your position..." : "Use Your Position"}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        zoom={8}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={HOT_URL}
        />
        {!!cities &&
          cities.map((cityData) => {
            const { lat, lng } = cityData.position;
            return (
              <Marker position={[lat, lng]} key={cityData.id}>
                <Popup>
                  This is a city {cityData.cityName} in {cityData.country}
                </Popup>
              </Marker>
            );
          })}
        <DetectClick />
        <RecenterAutomatically mapPosition={mapPosition} />
      </MapContainer>
    </div>
  );
}

export default Map;
