import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, Divider, Typography, message, Card } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import { login, register } from '../../api/authApi';  // Importa le API di autenticazione
import { useAuth } from '../../context/authContext';  // Usa il contesto di autenticazione
import logo from '../../assets/images/logo.JPG';
import './Login.css';

const { Title, Text } = Typography;

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    birthdate: '',
  });

  const { login } = useAuth(); // Accedi alla funzione di login dal contesto
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const endpoint = isLogin
      ? 'http://localhost:4000/api/auth/login'
      : 'http://localhost:4000/api/auth/register';
  
    const dataToSend = isLogin
      ? {
          email: formData.email,
          password: formData.password,
        }
      : {
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          password: formData.password,
          birthdate: formData.birthdate,
        };
  
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }
  
      if (data.token) {
        localStorage.setItem('token', data.token);
        login(data.token); // Chiama la funzione di login dal contesto
        navigate('/');
      } else {
        throw new Error('Token not found in response');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setErrorMessage(error.message);
      message.error(error.message);
    }
  };

  // Funzione per il login con Google
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:4000/api/auth/google'; // Backend deve gestire il redirect
  };

  // Effetto per gestire il reindirizzamento di Google OAuth
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tokenFromUrl = urlParams.get('token');
  
    console.log('Token from URL:', tokenFromUrl);  // Debug
  
    if (tokenFromUrl) {
      localStorage.setItem('token', tokenFromUrl);
      login(tokenFromUrl);  // Funzione login che aggiorna lo stato utente nel contesto
      navigate('/', { replace: true });  // Reindirizza alla home
    } else {
      console.log('No token found in URL');  // Debug
    }
  }, [location, login, navigate]);
  
  
  

  return (
    <Row justify="center" align="middle" style={{ height: '100vh' }}>
      <Col xs={22} sm={16} md={12} lg={8}>
        <Card className="login-card" style={{ padding: '40px', borderRadius: '15px', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)' }}>
          <div className="text-center mb-4">
            <img src={logo} alt="Travel Mate Logo" className="login-logo img-fluid" style={{ width: '120px' }} />
          </div>
          <div className="auth-toggle mb-3 text-center">
            <Button
              type={isLogin ? 'primary' : 'default'}
              onClick={() => setIsLogin(true)}
              className={`toggle-button ${isLogin ? 'active-btn' : ''}`}
              style={{ width: '45%', marginRight: '10px' }}
            >
              Login
            </Button>
            <Button
              type={!isLogin ? 'primary' : 'default'}
              onClick={() => setIsLogin(false)}
              className={`toggle-button ${!isLogin ? 'active-btn' : ''}`}
              style={{ width: '45%' }}
            >
              Register
            </Button>
          </div>
          <Title level={3} className="text-center">{isLogin ? 'Welcome back!' : 'Create your account!'}</Title>
          <Button
            type="danger"
            block
            icon={<FaGoogle />}
            className="google-login-btn"
            onClick={handleGoogleLogin}
            style={{ marginBottom: '20px' }}
          >
            {isLogin ? 'Login with Google' : 'Sign up with Google'}
          </Button>
          <Divider>or</Divider>
          {errorMessage && <Text type="danger">{errorMessage}</Text>}
          <Form onFinish={handleSubmit} layout="vertical">
            {!isLogin && (
              <>
                <Form.Item name="name" rules={[{ required: true, message: 'Please input your name!' }]}>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Form.Item>
                <Form.Item name="surname" rules={[{ required: true, message: 'Please input your surname!' }]}>
                  <Input
                    type="text"
                    name="surname"
                    placeholder="Surname"
                    value={formData.surname}
                    onChange={handleChange}
                  />
                </Form.Item>
                <Form.Item name="birthdate" rules={[{ required: true, message: 'Please input your birthdate!' }]}>
                  <Input
                    type="date"
                    name="birthdate"
                    placeholder="Birthdate"
                    value={formData.birthdate}
                    onChange={handleChange}
                  />
                </Form.Item>
              </>
            )}
            <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
              <Input.Password
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block style={{ borderRadius: '8px' }}>
                {isLogin ? 'Login' : 'Register'}
              </Button>
            </Form.Item>
          </Form>
          <div className="text-center">
            <Button type="link" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Create an account' : 'Already have an account? Login'}
            </Button>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default LoginPage;
