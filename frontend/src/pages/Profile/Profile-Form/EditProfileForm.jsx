import { Form, Input, Button, Typography } from 'antd';
import moment from 'moment'; 
import './EditProfileForm.css';

const { Title } = Typography;

const EditProfileForm = ({ profileData, handleInputChange, handleSaveChanges }) => {
  
  const formattedBirthdate = profileData.birthdate
    ? moment(profileData.birthdate).format('YYYY-MM-DD')
    : '';

  return (
    <div className="edit-profile-form-container">
      <Title level={2}>Modifica Profilo</Title>
      <Form layout="vertical" className="edit-profile-form">
        <Form.Item label="Nome">
          <Input
            name="name"
            value={profileData.name}
            onChange={handleInputChange}
            placeholder="Inserisci il tuo nome"
          />
        </Form.Item>
        <Form.Item label="Cognome">
          <Input
            name="surname"
            value={profileData.surname}
            onChange={handleInputChange}
            placeholder="Inserisci il tuo cognome"
          />
        </Form.Item>
        <Form.Item label="Email">
          <Input
            name="email"
            value={profileData.email}
            onChange={handleInputChange}
            placeholder="Inserisci la tua email"
          />
        </Form.Item>
        <Form.Item label="Data di nascita">
          <Input
            type="date"
            name="birthdate"
            value={formattedBirthdate} 
            onChange={handleInputChange}
          />
        </Form.Item>
        <Button
          type="primary"
          onClick={handleSaveChanges}
          className="save-changes-button"
        >
          Salva Modifiche
        </Button>
      </Form>
    </div>
  );
};

export default EditProfileForm;
