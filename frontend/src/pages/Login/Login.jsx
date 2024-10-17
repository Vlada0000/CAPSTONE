import { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, Divider, Typography, message, Card } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import { login as loginApi, register as registerApi } from '../../api/authApi';
import { useAuth } from '../../context/authContext';  
import logo from '../../assets/images/logo.JPG';
import './Login.css';

const { Title, Text } = Typography;

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    birthdate: '',
  });

  const { login } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMessage) {
      setErrorMessage(''); 
    }
  };

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        const response = await loginApi({ email: formData.email, password: formData.password });
        if (response.token) {
          localStorage.setItem('token', response.token);
          login(response.token);
          setErrorMessage(''); 
          navigate('/');
        } else {
          throw new Error('Token non trovato');
        }
      } else {
        await registerApi(formData); 
        message.success('Registrazione completata! Effettua il login.');
        setIsLogin(true); 
        setErrorMessage('');  
        navigate('/login');
      }
    } catch (error) {
      console.error('Errore di autenticazione:', error);
      setErrorMessage(error.message || 'Autenticazione fallita');
      message.error(error.message || 'Autenticazione fallita');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/api/auth/google`; 
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tokenFromUrl = urlParams.get('token');

    if (tokenFromUrl) {
      localStorage.setItem('token', tokenFromUrl);
      login(tokenFromUrl);  
      setErrorMessage('');  
      navigate('/', { replace: true });
    }
  }, [location, login, navigate]);

  return (
    <Row justify="center" align="middle" style={{ height: '100vh' }}>
      <Col xs={22} sm={16} md={12} lg={8}>
        <Card className="login-card">
          <div className="text-center mb-4">
            <img src={logo} alt="Travel Mate Logo" className="login-logo" />
          </div>

          <div className="auth-toggle mb-3 text-center">
            <Button
              type={isLogin ? 'primary' : 'default'}
              onClick={() => { setIsLogin(true); setErrorMessage(''); }} 
              className={`toggle-button ${isLogin ? 'active-btn' : ''}`}
              style={{ width: '45%', marginRight: '10px' }}
            >
              Login
            </Button>
            <Button
              type={!isLogin ? 'primary' : 'default'}
              onClick={() => { setIsLogin(false); setErrorMessage(''); }}  
              className={`toggle-button ${!isLogin ? 'active-btn' : ''}`}
              style={{ width: '45%' }}
            >
              Register
            </Button>
          </div>

          <Title level={3} className="text-center">{isLogin ? 'Bentornato!' : 'Crea il tuo Account!'}</Title>
          
          <Button
            type="danger"
            block
            icon={<FaGoogle />}
            className="google-login-btn"
            onClick={handleGoogleLogin}
            style={{ marginBottom: '20px' }}
          >
            {isLogin ? 'Login con Google' : 'Registrati con Google'}
          </Button>
          
          <Divider>o</Divider>

          {errorMessage && <Text type="danger">{errorMessage}</Text>}

          <Form onFinish={handleSubmit} layout="vertical">
            {!isLogin && (
              <>
                <Form.Item name="name" rules={[{ required: true, message: 'Inserisci il tuo nome!' }]}>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Nome"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Form.Item>
                <Form.Item name="surname" rules={[{ required: true, message: 'Inserisci il tuo cognome!' }]}>
                  <Input
                    type="text"
                    name="surname"
                    placeholder="Cognome"
                    value={formData.surname}
                    onChange={handleChange}
                  />
                </Form.Item>
                <Form.Item name="birthdate" rules={[{ required: true, message: 'Inserisci la tua data di nascita!' }]}>
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

            <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Per favore, inserisci una e-mail valida!' }]}>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: 'Inserisci una password!' }]}>
              <Input.Password
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </Form.Item>

            <Form.Item>
              <Button  htmlType="submit" block style={{ borderRadius: '8px' }}>
                {isLogin ? 'Login' : 'Register'}
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center">
            <Button type="link" onClick={() => { setIsLogin(!isLogin); setErrorMessage(''); }}>
              {isLogin ? 'Crea un nuovo account' : 'Hai già un account? Login'}
            </Button>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default Login;
