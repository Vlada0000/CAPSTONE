const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/messages`;;

// Funzione per ottenere i messaggi di un viaggio
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
export const sendMessageApi = async (tripId, messageData, token) => {
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
        console.error('Errore nell\'invio del messaggio, risposta non OK:', errorData); 
        throw new Error(errorData.message || 'Errore nell\'invio del messaggio');
      }
  
      const jsonResponse = await response.json();
    
      return jsonResponse;
    } catch (error) {
      console.error('Errore nell\'invio del messaggio', error);
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


export const sendMessageSocket = (socket, tripId, messageData) => {
    if (!socket || typeof socket.emit !== 'function') {
      console.error('Socket non è definito o non è pronto per inviare messaggi');
      return;
    }
  
   
    socket.emit('send_message', { tripId, ...messageData });
  };
  
  export const listenForMessages = (socket, tripId, userId, callback) => {
    if (socket) {
      const event = `message_${tripId}_${userId}`;
     
      socket.on(event, (message) => {
       
        callback(message);
      });
    }
  };
  


export const removeMessageListener = (socket) => {
  if (socket) {
    try {
      socket.off('receive_message'); 
     
    } catch (error) {
      console.error('Errore durante la rimozione del listener dei messaggi:', error);
    }
  } else {
    console.error('Socket non disponibile per rimuovere il listener dei messaggi');
  }
};
export const deleteMessage = async (tripId, messageId, token) => {
    try {
      const response = await fetch(`${API_URL}/${tripId}/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Errore durante l\'eliminazione del messaggio');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Errore durante l\'eliminazione del messaggio:', error);
      throw error;
    }
  };
  
  // API per modificare un messaggio
  export const editMessage = async (tripId, messageId, content, token) => {
    try {
      const response = await fetch(`${API_URL}/${tripId}/messages/${messageId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
  
      if (!response.ok) {
        throw new Error('Errore durante la modifica del messaggio');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Errore durante la modifica del messaggio:', error);
      throw error;
    }
  };