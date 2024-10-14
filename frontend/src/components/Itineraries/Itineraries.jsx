import { useState, useEffect } from 'react';
import { Card, Collapse, Spin, Alert, message } from 'antd';
import { getItineraries, addItinerary, updateItinerary, deleteItinerary } from '../../api/itineraryApi';
import { useAuth } from '../../context/authContext';
import { useParams } from 'react-router-dom';
import ItineraryForm from '../Itineraries/ItineraryForm';
import ItineraryList from '../Itineraries/ItineraryList';
import MyMap from '../Minicomponents/Map/MyMap';

const Itineraries = () => {
  const { user } = useAuth();
  const { tripId } = useParams();
  const [itineraries, setItineraries] = useState([]);
  const [editingItinerary, setEditingItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const fetchedItineraries = await getItineraries(tripId, user.token);
        setItineraries(fetchedItineraries);
        setLoading(false);
      } catch (error) {
        console.error('Errore nel recupero degli itinerari:', error);
        setError('Errore nel recupero degli itinerari');
        setLoading(false);
      }
    };

    if (tripId) {
      fetchItineraries();
    }
  }, [tripId, user.token]);

  const handleAddItinerary = async (values) => {
    try {
      const itineraryData = { trip: tripId, ...values };
      const addedItinerary = await addItinerary(itineraryData, user.token);
      setItineraries((prev) => [...prev, addedItinerary]);
      message.success('Tappa aggiunta con successo!');
      setIsPanelOpen(false);
    } catch (error) {
      console.error('Errore durante l\'aggiunta della tappa:', error);
      message.error("Errore durante l'aggiunta della tappa");
    }
  };

  const handleUpdateItinerary = async (values) => {
    try {
      const updatedItinerary = await updateItinerary(editingItinerary._id, values, user.token);
      setItineraries((prev) =>
        prev.map((itinerary) => 
          itinerary._id === editingItinerary._id ? updatedItinerary : itinerary
        )
      );
      message.success('Tappa aggiornata con successo!');
      setEditingItinerary(null);
      setIsPanelOpen(false);
    } catch (error) {
      console.error('Errore durante l\'aggiornamento della tappa:', error);
      message.error("Errore durante l'aggiornamento della tappa");
    }
  };

  const handleDeleteItinerary = async (id) => {
    try {
      await deleteItinerary(id, user.token);
      setItineraries((prev) => prev.filter((itinerary) => itinerary._id !== id));
      message.success('Tappa eliminata con successo');
    } catch (error) {
      console.error('Errore durante l\'eliminazione della tappa:', error);
      message.error("Errore durante l'eliminazione della tappa");
    }
  };

  const handleEditItinerary = (itinerary) => {
    setEditingItinerary(itinerary);
    setIsPanelOpen(true);
  };

  const handleCancel = () => {
    setEditingItinerary(null);
    setIsPanelOpen(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert message="Errore" description={error} type="error" showIcon />;
  }

  const paginatedItineraries = itineraries.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const collapseItems = [
    {
      key: '1',
      label: editingItinerary ? 'Modifica Tappa' : 'Aggiungi Tappa',
      children: (
        <ItineraryForm
          initialValues={editingItinerary || { location: '', date: null, activities: '', notes: '' }}
          onSubmit={editingItinerary ? handleUpdateItinerary : handleAddItinerary}
          onCancel={handleCancel}
        />
      ),
    },
  ];

  return (
    <Card title="Gestisci Itinerario">
      <Collapse
        activeKey={isPanelOpen ? ['1'] : []}
        onChange={() => setIsPanelOpen(!isPanelOpen)}
        items={collapseItems} 
      />
      <ItineraryList
        itineraries={paginatedItineraries}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onEdit={handleEditItinerary}
        onDelete={handleDeleteItinerary}
      />
      <MyMap />
    </Card>
  );
};

export default Itineraries;
