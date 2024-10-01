import React, { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  LayersControl,
  ZoomControl,
  useMap, // Importa useMap per controllare la mappa
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Modal, Input, Button, Tooltip, message } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import './MyMap.css';

// Icone personalizzate per Leaflet
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Configura l'icona di default dei marker
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

// Componente per centrare la mappa sulla nuova posizione
const RecenterMap = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 13); // Centra la mappa sulla nuova posizione
    }
  }, [position, map]);
  return null;
};

const { BaseLayer } = LayersControl;

const InteractiveMap = () => {
  const [markers, setMarkers] = useState([]);
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentMarker, setCurrentMarker] = useState(null);
  const [descriptionInput, setDescriptionInput] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [position, setPosition] = useState([51.505, -0.09]); // Posizione di default

  // Carica i marker da localStorage quando il componente viene montato
  useEffect(() => {
    const storedMarkers = JSON.parse(localStorage.getItem('markers'));
    if (storedMarkers) {
      setMarkers(storedMarkers);
    }
  }, []);

  // Salva i marker su localStorage ogni volta che vengono aggiornati
  useEffect(() => {
    localStorage.setItem('markers', JSON.stringify(markers));
  }, [markers]);

  // Gestisce il click sulla mappa per aggiungere un nuovo marker
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setCurrentMarker({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          description: '',
        });
        setDescriptionInput('');
        setIsModalVisible(true);
      },
    });
    return null;
  };

  // Aggiunge un nuovo marker
  const handleAddMarker = () => {
    if (currentMarker) {
      const newMarker = { ...currentMarker, description: descriptionInput };
      setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
      setIsModalVisible(false);
      message.success('Marker aggiunto con successo!');
    }
  };

  // Aggiorna la descrizione di un marker
  const handleUpdateMarker = (index, description) => {
    const updatedMarkers = markers.map((marker, i) =>
      i === index ? { ...marker, description } : marker
    );
    setMarkers(updatedMarkers);
    message.success('Marker aggiornato con successo!');
  };

  // Elimina un marker specifico
  const handleDeleteMarker = (index) => {
    Modal.confirm({
      title: 'Sei sicuro di voler eliminare questo marker?',
      onOk: () => {
        const updatedMarkers = markers.filter((_, i) => i !== index);
        setMarkers(updatedMarkers);
        message.success('Marker eliminato con successo!');
      },
    });
  };

  // Elimina tutti i marker
  const handleClearAllMarkers = () => {
    Modal.confirm({
      title: 'Sei sicuro di voler eliminare tutti i marker?',
      onOk: () => {
        setMarkers([]);
        message.success('Tutti i marker sono stati eliminati!');
      },
    });
  };

  // Ricerca di una località (utilizzando l'API Nominatim di OpenStreetMap)
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

  // Geolocalizzazione dell'utente
  const handleMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
          message.success('Posizione trovata!');
        },
        (err) => {
          console.error('Errore nella geolocalizzazione:', err.message);
          if (err.code === 1) {
            message.error('Permesso di geolocalizzazione negato.');
          } else if (err.code === 2) {
            message.error('Posizione non disponibile.');
          } else if (err.code === 3) {
            message.error('Timeout durante la ricerca della posizione.');
          } else {
            message.error('Errore sconosciuto nella geolocalizzazione.');
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      message.error('Geolocalizzazione non supportata dal browser');
    }
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
          style={{ width: 300 }}
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

        <MapClickHandler />

        <RecenterMap position={position} /> {/* Aggiungi questo componente per centrare la mappa */}

        {markers.map((marker, index) => (
          <Marker key={index} position={[marker.lat, marker.lng]}>
            <Popup minWidth={200}>
              <div className="marker-popup">
                <h3>Informazioni sulla Posizione</h3>
                <Input.TextArea
                  rows={2}
                  value={marker.description}
                  onChange={(e) => handleUpdateMarker(index, e.target.value)}
                  placeholder="Inserisci una descrizione"
                />
                <div className="popup-actions">
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => handleUpdateMarker(index, marker.description)}
                  >
                    Aggiorna
                  </Button>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteMarker(index)}
                  >
                    Elimina
                  </Button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Modale per aggiungere marker */}
      <Modal
        title="Aggiungi Descrizione al Marker"
        open={isModalVisible}
        onOk={handleAddMarker}
        onCancel={() => setIsModalVisible(false)}
        okText="Aggiungi Marker"
      >
        <Input.TextArea
          rows={4}
          value={descriptionInput}
          onChange={(e) => setDescriptionInput(e.target.value)}
          placeholder="Inserisci una descrizione per questo marker"
        />
      </Modal>
    </div>
  );
};

export default InteractiveMap;
