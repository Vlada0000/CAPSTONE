
const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/auth`;


// Register a new user
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

// Login a user


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
  
    // Salva il token nel localStorage
    localStorage.setItem('token', data.token);
  
    // Restituisci i dati dell'utente
    return data;
  };
  

// Handle Google OAuth callback
export const googleCallback = async () => {
  // This URL needs to be the redirect URL you use in your Google OAuth configuration
  const googleCallbackUrl = `${API_URL}/google/callback`;

  // Perform a GET request to the Google callback URL
  const response = await fetch(googleCallbackUrl);

  if (!response.ok) {
    throw new Error('Failed to authenticate with Google');
  }

  // Extract the token from the URL
  const data = await response.json();
  return data.token;
};
