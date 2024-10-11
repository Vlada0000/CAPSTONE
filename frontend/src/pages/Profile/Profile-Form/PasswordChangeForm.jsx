import { Form, Input, Button, Typography } from 'antd';
import './PasswordChangeForm.css';

const { Title } = Typography;

const PasswordChangeForm = ({
  passwordData,
  setPasswordData,
  handlePasswordChange,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="password-change-form-container">
      <Title level={2} className="text-center">Cambia Password</Title>
      <Form layout="vertical" className="password-change-form">
        <Form.Item label="Vecchia Password">
          <Input.Password
            name="oldPassword"
            value={passwordData.oldPassword}
            onChange={handleChange}
            placeholder="Inserisci la vecchia password"
          />
        </Form.Item>
        <Form.Item label="Nuova Password">
          <Input.Password
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handleChange}
            placeholder="Inserisci la nuova password"
          />
        </Form.Item>
        <Button
          type="primary"
          onClick={handlePasswordChange}
          className="change-password-button"
        >
          Aggiorna Password
        </Button>
      </Form>
    </div>
  );
};

export default PasswordChangeForm;
