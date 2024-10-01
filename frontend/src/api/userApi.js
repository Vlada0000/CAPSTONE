const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/users`;;


export const getLoggedInUserProfile = async (token) => {
    const response = await fetch(`${API_URL}/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
  
    return response.json();
  };

  export const updateUserPassword = async (passwordData, token) => {
    const response = await fetch(`${API_URL}/update-password`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(passwordData),
    });
  
    if (!response.ok) {
      throw new Error('Errore durante la modifica della password');
    }
  
    return await response.json();
  };
export const getUserTrips = async (token) => {
    const response = await fetch(`${API_URL}/me/trips`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      throw new Error('Errore nel recupero dei viaggi');
    }
  
    const data = await response.json();
    return data;
  };
  

  export const getUserProfileById = async (userId, token) => {
    const response = await fetch(`${API_URL}/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch user profile by ID');
    }
  
    return response.json();
  };
  
  // Get list of users with optional search
  export const getUsers = async (search = '', token) => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    const response = await fetch(`${API_URL}${query}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
  
    return response.json();
  };
  
  
  export const updateUserProfile = async (userData, token) => {
    const response = await fetch(`${API_URL}/me`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
  
    if (!response.ok) {
      throw new Error('Failed to update user profile');
    }
  
    return response.json();
  };
  

export const uploadProfileImage = async (file, token) => {
    const formData = new FormData();
    formData.append('profileImage', file);
  
    const response = await fetch(`${API_URL}/me/profile-image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        
      },
      body: formData,
    });
  
    if (!response.ok) {
      throw new Error('Failed to upload profile image');
    }
  
    return response.json();
  };
  
  
  export const deleteUserProfile = async (token) => {
    const response = await fetch(`${API_URL}/me`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to delete user profile');
    }
  
    return response.json();
  };