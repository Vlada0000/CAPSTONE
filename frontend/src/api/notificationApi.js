const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/notifications`;;


export const markNotificationAsRead = async (notificationId, token) => {
  try {
    const response = await fetch(`${API_URL}/${notificationId}/read`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Errore nel marcare la notifica come letta');
    }

    return await response.json();
  } catch (error) {
    console.error('Errore nel marcare la notifica come letta:', error);
    throw error;
  }
};


export const markAllNotificationsAsRead = async (token) => {
  try {
    const response = await fetch(`${API_URL}/read/all`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Errore nel marcare tutte le notifiche come lette');
    }

    return await response.json();
  } catch (error) {
    console.error('Errore nel marcare tutte le notifiche come lette:', error);
    throw error;
  }
};


export const getNotifications = async (token) => {
  try {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Errore nel recupero delle notifiche');
    }

    return await response.json();
  } catch (error) {
    console.error('Errore nel recupero delle notifiche:', error);
    throw error;
  }
};
