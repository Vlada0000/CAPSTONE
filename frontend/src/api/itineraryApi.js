const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/itineraries`;

// Funzione per ottenere tutti gli itinerari
export const getItineraries = async (tripId, token, page = 1, limit = 10) => {
    const response = await fetch(`${API_URL}/${tripId}?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Errore nel recupero degli itinerari');
    }
  
   
    const data = await response.json();
    return data.itineraries || [];
  };
export const getAllItineraries = async (token) => {
    const response = await fetch(`${API_URL}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Errore nel recupero degli itinerari');
    }
  
    return await response.json();
  };
// Funzione per aggiungere un itinerario
export const addItinerary = async (itineraryData, token) => {
  const response = await fetch(`${API_URL}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(itineraryData),
  });

  if (!response.ok) {
    throw new Error('Errore nell\'aggiunta dell\'itinerario');
  }

  return await response.json();
};

// Funzione per aggiornare un itinerario
export const updateItinerary = async (itineraryId, itineraryData, token) => {
  const response = await fetch(`${API_URL}/${itineraryId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(itineraryData),
  });

  if (!response.ok) {
    throw new Error('Errore nell\'aggiornamento dell\'itinerario');
  }

  return await response.json();
};

// Funzione per eliminare un itinerario
export const deleteItinerary = async (itineraryId, token) => {
  const response = await fetch(`${API_URL}/${itineraryId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Errore nell\'eliminazione dell\'itinerario');
  }

  return await response.json();
};
