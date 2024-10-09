const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/messages`;

export const getMessages = async (tripId, token) => {
  try {
    const response = await fetch(`${API_URL}/${tripId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Errore nel recupero dei messaggi');
    }

    return await response.json();
  } catch (error) {
    console.error('Errore nel recupero dei messaggi', error);
    throw error;
  }
};

export const sendMessage = async (tripId, messageData, token) => {
  try {
    const response = await fetch(`${API_URL}/${tripId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(messageData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Errore nell\'invio del messaggio');
    }

    return await response.json();
  } catch (error) {
    console.error('Errore nell\'invio del messaggio', error);
    throw error;
  }
};

export const deleteMessage = async (tripId, messageId, token) => {
  try {
    const response = await fetch(`${API_URL}/${tripId}/messages/${messageId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Errore durante l\'eliminazione del messaggio');
    }

    return await response.json();
  } catch (error) {
    console.error('Errore durante l\'eliminazione del messaggio:', error);
    throw error;
  }
};

export const editMessage = async (tripId, messageId, content, token) => {
  try {
    const response = await fetch(`${API_URL}/${tripId}/messages/${messageId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error('Errore durante la modifica del messaggio');
    }

    return await response.json();
  } catch (error) {
    console.error('Errore durante la modifica del messaggio:', error);
    throw error;
  }
};
