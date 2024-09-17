import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import styles from "./Map.module.css";
import { useEffect, useState } from "react";
import { useCities } from "../Contexts/CityContexts";
import { useGeolocation } from "../hooks/useGeoLoaction";
import Buttons from "./Buttons";
import { useURLPosition } from "../hooks/useURL";

function Map() {
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([28.6139, 77.209]); // New Delhi, India

  const [mapLat, mapLng] = useURLPosition();
  const {
    isLoading: isLoadingPosition,
    position: geoLoactionPosition,
    getPosition,
  } = useGeolocation();

  useEffect(
    function () {
      if (mapLat && mapLng) {
        setMapPosition([parseFloat(mapLat), parseFloat(mapLng)]);
      }
    },
    [mapLat, mapLng]
  );

  useEffect(
    function () {
      if (geoLoactionPosition)
        setMapPosition([geoLoactionPosition.lat, geoLoactionPosition.lng]);
    },
    [geoLoactionPosition]
  );

  return (
    <div className={styles.mapContainer}>
      {!geoLoactionPosition && (
        <Buttons type="position" onClick={getPosition}>
          {isLoadingPosition ? "Loading..." : "Use Your position"}
        </Buttons>
      )}
      <MapContainer
        center={mapPosition}
        zoom={9}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span> <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition} />
        <MapClick />
      </MapContainer>
    </div>
  );
}

function MapClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

export default Map;
