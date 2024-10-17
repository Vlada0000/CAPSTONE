import { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Spinner, Carousel } from 'react-bootstrap';
import { fetchAlbumPhotos, uploadAlbumPhotos } from '../../api/tripApi'; 
import { useAuth } from '../../context/authContext'; 

const PhotoAlbum = ({ tripId }) => {
  const { user } = useAuth(); 
  const [photos, setPhotos] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const albumPhotos = await fetchAlbumPhotos(tripId, user.token); 
        setPhotos(albumPhotos);
      } catch (err) {
        setError(err.message);
      }
    };

    loadPhotos();
  }, [tripId, user.token]);

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      setError('Per favore seleziona almeno una foto');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      const uploadedPhotos = await uploadAlbumPhotos(tripId, selectedFiles, user.token); 
      setSuccessMessage('Foto caricate con successo!');
      setPhotos((prevPhotos) => [...prevPhotos, ...uploadedPhotos]);
      setSelectedFiles([]);
    } catch (error) {
      setError(error.message || 'Si è verificato un errore');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={{ marginTop: '50px', maxWidth: '800px' }}>
      <h2 className="text-center mb-4" style={{ color: 'black' }}>Album Fotografico del Viaggio</h2>

      {error && (
        <Alert
          variant="danger"
          onClose={() => setError(null)}
          dismissible
          style={{ textAlign: 'center', marginBottom: '20px' }}
        >
          {error}
        </Alert>
      )}
      {successMessage && (
        <Alert
          variant="success"
          onClose={() => setSuccessMessage('')}
          dismissible
          style={{ textAlign: 'center', marginBottom: '20px' }}
        >
          {successMessage}
        </Alert>
      )}

      <Form onSubmit={handleSubmit} className="mb-5" style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
        <Form.Group controlId="formFileMultiple" className="mb-3">
          <Form.Label style={{ fontWeight: 'bold' }}>Seleziona le foto da caricare</Form.Label>
          <Form.Control type="file" multiple accept="image/*" onChange={handleFileChange} />
        </Form.Group>
        <Button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '10px', fontWeight: 'bold' }}
        >
          {loading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />{' '}
              Caricamento...
            </>
          ) : (
            'Carica Foto'
          )}
        </Button>
      </Form>

      {Array.isArray(photos) && photos.length > 0 && (
        <Carousel fade className="shadow" style={{ borderRadius: '8px', overflow: 'hidden' }}>
          {photos.map((photo, index) => (
            <Carousel.Item key={index}>
              <img
                src={photo}
                alt={`Slide ${index}`}
                className="d-block w-100"
                style={{ maxHeight: '600px', objectFit: 'cover', borderRadius: '8px' }}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      )}
    </Container>
  );
};

export default PhotoAlbum;
