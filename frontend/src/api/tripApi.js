// frontend/src/api/tripApi.js

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/trips`;; // Porta corretta del backend

// Funzione per ottenere tutti i viaggi
export const getTrips = async (token, page = 1, limit = 10) => {
    const response = await fetch(`${API_URL}?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch trips');
    }
  
    const data = await response.json();
    return data.trips || []; // Ritorna l'array dei viaggi
  };
  
// Funzione per ottenere i partecipanti di un viaggio
export const getParticipants = async (tripId, token) => {
    const response = await fetch(`${API_URL}/${tripId}/participants`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      throw new Error('Errore nel recupero dei partecipanti');
    }
  
    return await response.json();
  };
  
// Funzione per creare un nuovo viaggio
export const createTrip = async (tripData, token) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tripData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create trip');
  }

  return await response.json();
};

// Funzione per aggiornare un viaggio
export const updateTrip = async (tripId, tripData, token) => {
  const response = await fetch(`${API_URL}/${tripId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tripData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update trip');
  }

  return await response.json();
};

// Funzione per eliminare un viaggio
export const deleteTrip = async (tripId, token) => {
  const response = await fetch(`${API_URL}/${tripId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete trip');
  }

  return await response.json();
};

// Funzione per aggiungere una foto a un viaggio
export const addPhotoToTrip = async (tripId, photoFile, token) => {
  const formData = new FormData();
  formData.append('photo', photoFile);

  const response = await fetch(`${API_URL}/${tripId}/photo`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      // 'Content-Type' non è necessario con FormData
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to upload photo');
  }

  return await response.json();
};

// Funzione per invitare un utente a un viaggio
export const inviteUserToTrip = async (tripId, email, token) => {
  const response = await fetch(`${API_URL}/${tripId}/invite`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to invite user');
  }

  return await response.json();
};

export const removeUserFromTrip = async (tripId, participantId, token) => {
    try {
      const response = await fetch(`${API_URL}/${tripId}/participants/${participantId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Errore durante la rimozione del partecipante');
    }
    console.log('Partecipante rimosso con successo:', result);
  } catch (error) {
    console.error('Errore durante la rimozione del partecipante:', error);
  }
};
// Funzione per accettare un invito al viaggio
export const acceptTripInvitation = async (tripId, token) => {
    try {
      const response = await fetch(`${API_URL}/${tripId}/accept`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      // Se la risposta non è OK, lancia un errore
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to accept trip invitation');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Errore nella chiamata API per accettare invito:', error);
      throw new Error('Errore nel processo di accettazione dell\'invito');
    }
  };
  
  
  
// Funzione per rifiutare un invito al viaggio
export const declineTripInvitation = async (tripId, token) => {
    try {
      const response = await fetch(`${API_URL}/${tripId}/decline`, {
        method: 'PATCH', // Cambiato il metodo a PATCH, se appropriato
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to decline trip invitation');
      }
  
      return await response.json(); // Restituisci la risposta JSON
    } catch (error) {
      console.error('Errore nella chiamata API per rifiutare invito:', error);
      throw new Error('Errore nel processo di rifiuto dell\'invito');
    }
  };
  
// Funzione per ottenere i dettagli di un viaggio
export const getTripById = async (tripId, token) => {
  const response = await fetch(`${API_URL}/${tripId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch trip details');
  }

  return await response.json();
};
