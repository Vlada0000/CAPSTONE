const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/expenses`;

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

  return response.json();
};


export const calculateSplit = async (tripId, token) => {
    try {
      const response = await fetch(`${API_URL}/${tripId}/split`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
  
      if (!data.transactions || !data.participants) {
        throw new Error('Dati mancanti nel calcolo delle spese');
      }
  
      const filteredTransactions = data.transactions.map((transaction) => {
        
        const selectedParticipants = Array.isArray(transaction.selectedParticipants)
          ? transaction.selectedParticipants
          : [];
  
        const amountPerParticipant = selectedParticipants.length > 0 
          ? transaction.amount / selectedParticipants.length 
          : 0;
  
        return {
          ...transaction,
          selectedParticipants,
          amountPerParticipant,
        };
      });
  
      return {
        transactions: filteredTransactions,
        totalExpenses: data.totalExpenses || 0,
        participants: data.participants,
        balances: data.balances || {},
      };
    } catch (error) {
      console.error('Errore nel calcolo delle spese:', error);
      throw error;
    }
  };
  
  
  