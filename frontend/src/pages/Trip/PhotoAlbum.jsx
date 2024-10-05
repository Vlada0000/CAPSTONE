import React, { useState, useEffect } from 'react';
import {
  Container,
  Form,
  Button,
  Alert,
  Spinner,
  Carousel,
} from 'react-bootstrap';

const PhotoAlbum = ({ tripId }) => {
  const [photos, setPhotos] = useState([]); 
  const [selectedFiles, setSelectedFiles] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 
  const [successMessage, setSuccessMessage] = useState(''); 

  
  const fetchAlbumPhotos = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/trips/${tripId}/album`);
      const result = await response.json();
      if (response.ok && Array.isArray(result.album)) {
        setPhotos(result.album);
      } else {
        throw new Error(result.message || 'Errore nel recupero delle foto dell\'album');
      }
    } catch (error) {
      setError(error.message || 'Errore durante il recupero dell\'album');
    }
  };


  useEffect(() => {
    fetchAlbumPhotos();
  }, [tripId]);

  
  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      setError('Per favore seleziona almeno una foto');
      return;
    }

    const formData = new FormData();
    Array.from(selectedFiles).forEach((file) => {
      formData.append('photos', file);
    });

    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      const response = await fetch(`http://localhost:4000/api/trips/${tripId}/album`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok && Array.isArray(result.photos)) {
        setSuccessMessage('Foto caricate con successo!');
        setPhotos((prevPhotos) => [...prevPhotos, ...result.photos]);
        setSelectedFiles([]); 
      } else {
        throw new Error(result.message || 'Errore nel caricamento delle foto');
      }
    } catch (error) {
      setError(error.message || 'Si è verificato un errore');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Album Fotografico del Viaggio</h2>

      {/* Messaggi di errore e successo */}
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}
      {successMessage && (
        <Alert
          variant="success"
          onClose={() => setSuccessMessage('')}
          dismissible
        >
          {successMessage}
        </Alert>
      )}

      {/* Form per il caricamento delle foto */}
      <Form onSubmit={handleSubmit} className="mb-5">
        <Form.Group controlId="formFileMultiple" className="mb-3">
          <Form.Label>Seleziona le foto da caricare</Form.Label>
          <Form.Control
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />{' '}
              Caricamento...
            </>
          ) : (
            'Carica Foto'
          )}
        </Button>
      </Form>

      {/* Carosello per visualizzare le foto */}
      {Array.isArray(photos) && photos.length > 0 && (
        <Carousel fade className="shadow">
          {photos.map((photo, index) => (
            <Carousel.Item key={index}>
              <img
                src={photo}
                alt={`Slide ${index}`}
                className="d-block w-100"
                style={{ maxHeight: '600px', objectFit: 'cover' }}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      )}
    </Container>
  );
};

export default PhotoAlbum;
