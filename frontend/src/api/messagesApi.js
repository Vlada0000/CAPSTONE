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
      console.log('Invio messaggio con token:', token); 
      console.log('Dati del messaggio inviato:', messageData); 
  
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
        console.error('Errore nell\'invio del messaggio, risposta non OK:', errorData); r
        throw new Error(errorData.message || 'Errore nell\'invio del messaggio');
      }
  
      const jsonResponse = await response.json();
      console.log('Risposta del server dopo l\'invio del messaggio:', jsonResponse); 
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
  
    console.log('Inviando messaggio via WebSocket:', messageData);
    socket.emit('send_message', { tripId, ...messageData });
  };
  
  export const listenForMessages = (socket, tripId, userId, callback) => {
    if (socket) {
      const event = `message_${tripId}_${userId}`;
      console.log(`Ascolto per nuovi messaggi su ${event}...`);
      socket.on(event, (message) => {
        console.log('Messaggio ricevuto via WebSocket:', message);
        callback(message);
      });
    }
  };
  


export const removeMessageListener = (socket) => {
  if (socket) {
    try {
      socket.off('receive_message'); 
      console.log('Listener dei messaggi rimosso');
    } catch (error) {
      console.error('Errore durante la rimozione del listener dei messaggi:', error);
    }
  } else {
    console.error('Socket non disponibile per rimuovere il listener dei messaggi');
  }
};
