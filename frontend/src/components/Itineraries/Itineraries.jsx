import React, { useState, useEffect } from 'react';
import { Card, Button, Collapse, Spin, Alert, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getItineraries, addItinerary, updateItinerary, deleteItinerary } from '../../api/itineraryApi';
import { useAuth } from '../../context/authContext';
import { useParams } from 'react-router-dom';
import ItineraryForm from '../Itineraries/ItineraryForm';
import ItineraryList from '../Itineraries/ItineraryList';
import MyMap from '../Utils/Map/MyMap';

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
        console.error('Error fetching itineraries:', error);
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
      const itineraryData = {
        trip: tripId,
        ...values,
      };
      const addedItinerary = await addItinerary(itineraryData, user.token);
      setItineraries((prevItineraries) => [...prevItineraries, addedItinerary]);
      message.success('Itinerario aggiunto con successo!');
      setIsPanelOpen(false); 
    } catch (error) {
      console.error('Error adding itinerary:', error);
      message.error("Errore durante l'aggiunta dell'itinerario");
    }
  };

  const handleUpdateItinerary = async (values) => {
    try {
      const updatedItinerary = await updateItinerary(
        editingItinerary._id,
        values,
        user.token
      );
      setItineraries((prevItineraries) =>
        prevItineraries.map((itinerary) =>
          itinerary._id === editingItinerary._id ? updatedItinerary : itinerary
        )
      );
      message.success('Itinerario aggiornato con successo!');
      setEditingItinerary(null);
      setIsPanelOpen(false); 
    } catch (error) {
      console.error('Error updating itinerary:', error);
      message.error("Errore durante l'aggiornamento dell'itinerario");
    }
  };

  const handleDeleteItinerary = async (id) => {
    try {
      await deleteItinerary(id, user.token);
      setItineraries((prevItineraries) =>
        prevItineraries.filter((itinerary) => itinerary._id !== id)
      );
      message.success('Itinerario eliminato con successo');
    } catch (error) {
      console.error('Error deleting itinerary:', error);
      message.error("Errore durante l'eliminazione dell'itinerario");
    }
  };

  const handleEditItinerary = (itinerary) => {
    setEditingItinerary(itinerary);
    setIsPanelOpen(true); 
  };

  const handleAddButton = () => {
    setEditingItinerary(null);
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
      label: editingItinerary ? 'Modifica Itinerario' : 'Aggiungi Itinerario',
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
    <Card
      title="Gestisci Itinerari"  
    > 
      <Collapse activeKey={isPanelOpen ? ['1'] : []} onChange={() => setIsPanelOpen(!isPanelOpen)} items={collapseItems} /> 
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
