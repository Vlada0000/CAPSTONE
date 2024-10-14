import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, LayersControl, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Button, Input, message } from 'antd';
import { EnvironmentOutlined, DeleteOutlined } from '@ant-design/icons';
import RecenterMap from './RecenterMap';
import MapClickHandler from './MapClickHandler';
import MarkersList from './MarkersList';
import L from 'leaflet';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png'
import './MyMap.css';

const { BaseLayer } = LayersControl;

const DefaultIcon = L.icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41], 
  iconAnchor: [12, 41], 
  popupAnchor: [1, -34], 
  shadowSize: [41, 41], 
});

L.Marker.prototype.options.icon = DefaultIcon;

const MyMap = () => {
  const [markers, setMarkers] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [position, setPosition] = useState([51.505, -0.09]);

  useEffect(() => {
    const storedMarkers = JSON.parse(localStorage.getItem('markers'));
    if (storedMarkers) {
      setMarkers(storedMarkers);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('markers', JSON.stringify(markers));
  }, [markers]);

  const handleSearchLocation = async () => {
    if (!searchInput) return;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchInput)}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const firstResult = data[0];
        setPosition([parseFloat(firstResult.lat), parseFloat(firstResult.lon)]);
        message.success(`Posizione trovata: ${firstResult.display_name}`);
      } else {
        message.error('Località non trovata.');
      }
    } catch (error) {
      console.error('Errore nella ricerca della località:', error);
      message.error('Errore nella ricerca della località.');
    }
  };

  const handleMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
          message.success('Posizione trovata!');
        },
        (err) => handleGeolocationError(err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      message.error('Geolocalizzazione non supportata dal browser');
    }
  };

  const handleGeolocationError = (err) => {
    if (err.code === 1) {
      message.error('Permesso di geolocalizzazione negato.');
    } else if (err.code === 2) {
      message.error('Posizione non disponibile.');
    } else if (err.code === 3) {
      message.error('Timeout durante la ricerca della posizione.');
    } else {
      message.error('Errore sconosciuto nella geolocalizzazione.');
    }
  };

  const handleClearAllMarkers = () => {
    setMarkers([]);
    message.success('Tutti i marker sono stati eliminati!');
  };

  return (
    <div className="map-container">
      <div className="map-toolbar">
        <Input.Search
          placeholder="Cerca una località..."
          enterButton
          onSearch={handleSearchLocation}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{ width: 250 }}
        />
        <Button
          type="primary"
          icon={<EnvironmentOutlined />}
          onClick={handleMyLocation}
          style={{ marginLeft: 10 }}
        >
          La Mia Posizione
        </Button>
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={handleClearAllMarkers}
          style={{ marginLeft: 'auto' }}
        >
          Elimina Tutti i Marker
        </Button>
      </div>

      <MapContainer
        center={position}
        zoom={13}
        style={{ height: '600px', width: '100%' }}
        zoomControl={false}
      >
        <ZoomControl position="topright" />
        <LayersControl position="topright">
          <BaseLayer checked name="OpenStreetMap">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
          </BaseLayer>
          <BaseLayer name="Satellite">
            <TileLayer
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenTopoMap contributors"
            />
          </BaseLayer>
        </LayersControl>

        <MapClickHandler setMarkers={setMarkers} />
        <RecenterMap position={position} />
        <MarkersList markers={markers} setMarkers={setMarkers} />
      </MapContainer>
    </div>
  );
};

export default MyMap;
