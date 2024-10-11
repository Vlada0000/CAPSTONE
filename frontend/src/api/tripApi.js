const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/trips`;; 

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
      throw new Error(errorData.message || 'Errore nel recupero dei viaggi');
    }
  
    const data = await response.json();
    return data.trips || [];
  };
  

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
    throw new Error(errorData.message || 'Errore nella creazione del viaggio');
  }

  return await response.json();
};

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
    throw new Error(errorData.message || 'Errore nell\'aggiornamento del viaggio');
  }

  return await response.json();
};

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
    throw new Error(errorData.message || 'Errore nell\'eliminazione del viaggio');
  }

  return await response.json();
};

export const addPhotoToTrip = async (tripId, photoFile, token) => {
  const formData = new FormData();
  formData.append('photo', photoFile);

  const response = await fetch(`${API_URL}/${tripId}/photo`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
     
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Errore nel caricamento della foto');
  }

  return await response.json();
};


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
    throw new Error(errorData.message || 'Errore nell\'invito al viaggio');
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
    
  } catch (error) {
    console.error('Errore durante la rimozione del partecipante:', error);
  }
};

export const acceptTripInvitation = async (tripId, token) => {
    try {
      const response = await fetch(`${API_URL}/${tripId}/accept`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
     
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Errore nell\'accettazione dell\'invito');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Errore nella chiamata API per accettare invito:', error);
      throw new Error('Errore nel processo di accettazione dell\'invito');
    }
  };
  
export const declineTripInvitation = async (tripId, token) => {
    try {
      const response = await fetch(`${API_URL}/${tripId}/decline`, {
        method: 'PATCH', 
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Errore nel rifuto dell\'invito');
      }
  
      return await response.json(); 
    } catch (error) {
      console.error('Errore nella chiamata API per rifiutare invito:', error);
      throw new Error('Errore nel processo di rifiuto dell\'invito');
    }
  };
  

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
    throw new Error(errorData.message || 'Errore nel recupero dei dettagli del viaggio');
  }

  return await response.json();
};

export const fetchAlbumPhotos = async (tripId, token) => {
  try {
    const response = await fetch(`${API_URL}/${tripId}/album`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Errore nel recupero delle foto dell\'album');
    }

    return result.album;
  } catch (error) {
    throw new Error(error.message || 'Errore durante il recupero dell\'album');
  }
};

export const uploadAlbumPhotos = async (tripId, photos, token) => {
  const formData = new FormData();

  Array.from(photos).forEach((file) => {
    formData.append('photos', file);
  });

  try {
    const response = await fetch(`${API_URL}/${tripId}/album`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`, 
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Errore nel caricamento delle foto');
    }

    return result.photos;
  } catch (error) {
    throw new Error(error.message || 'Si è verificato un errore');
  }
};