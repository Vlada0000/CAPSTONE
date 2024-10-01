const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/auth`;


export const register = async (userData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to register');
  }

  return response.json();
};

export const login = async (loginData) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to login');
    }
  
    const data = await response.json();
  
   
    localStorage.setItem('token', data.token);
  
    
    return data;
  };
  


export const googleCallback = async () => {

  const googleCallbackUrl = `${API_URL}/google/callback`;

  const response = await fetch(googleCallbackUrl);
  if (!response.ok) {
    throw new Error('Failed to authenticate with Google');
  }

  const data = await response.json();
  return data.token;
};
