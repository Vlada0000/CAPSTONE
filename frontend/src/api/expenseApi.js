const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/expenses`;

// Aggiungere una nuova spesa
export const addExpense = async (expenseData, token) => {
    const response = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expenseData), 
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Errore durante l\'aggiunta della spesa');
    }
  
    return response.json();
  };
  

// Ottenere tutte le spese
export const getExpenses = async (tripId, token, page = 1, limit = 10) => {
    const response = await fetch(`${API_URL}?trip=${tripId}&page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Errore nel recupero delle spese');
    }
  
    const data = await response.json();
    return data.expenses || []; 
  };
// Modificare una spesa
export const updateExpense = async (id, expenseData, token) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(expenseData),
  });

  if (!response.ok) {
    throw new Error('Errore durante l\'aggiornamento della spesa');
  }

  return response.json();
};

// Eliminare una spesa
export const deleteExpense = async (id, token) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Errore durante l\'eliminazione della spesa');
  }

  return response.json();
};


export const getExpenseById = async (id, token) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Errore nel recupero della spesa');
  }

  return response.json();
};
// Funzione per ottenere tutte le spese dell'utente
export const getExpensesByUser = async (token) => {
    const response = await fetch(`${API_URL}?user=true`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Errore nel recupero delle spese');
    }
  
    return await response.json();
  };

// Funzione per ottenere la suddivisione delle spese per un viaggio specifico
export const calculateSplit = async (tripId, token) => {
    const response = await fetch(`${API_URL}/${tripId}/split`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Errore nel calcolo della suddivisione delle spese');
    }
  
    return await response.json();
  };
  