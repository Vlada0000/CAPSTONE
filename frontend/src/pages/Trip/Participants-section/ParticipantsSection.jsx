import { useState } from 'react';
import {
  Card,
  Avatar,
  Button,
  Form,
  Input,
  Popconfirm,
  message,
  Tooltip,
  List,
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  DeleteOutlined,
  CrownOutlined,
} from '@ant-design/icons';
import { inviteUserToTrip, removeUserFromTrip } from '../../../api/tripApi';
import './ParticipantsSection.css';

const ParticipantsSection = ({ trip, user, onTripUpdate }) => {
  const [emailToInvite, setEmailToInvite] = useState('');

  const handleInviteUser = async () => {
    if (!emailToInvite) {
      message.error('Inserisci un\'email valida.');
      return;
    }

    try {
      await inviteUserToTrip(trip._id, emailToInvite, user.token);
      message.success('Utente invitato con successo!');
      onTripUpdate({
        ...trip,
        participants: [
          ...trip.participants,
          { user: { email: emailToInvite }, status: 'pending' },
        ],
      });
      setEmailToInvite('');
    } catch (error) {
      console.error('Error inviting user:', error);
      message.error('Errore durante l\'invito dell\'utente');
    }
  };

  const handleRemoveParticipant = async (participantId) => {
    try {
      await removeUserFromTrip(trip._id, participantId, user.token);
      message.success('Partecipante rimosso con successo');
      onTripUpdate({
        ...trip,
        participants: trip.participants.filter(
          (p) => p.user._id !== participantId
        ),
      });
    } catch (error) {
      console.error('Error removing participant:', error);
      message.error('Errore durante la rimozione del partecipante');
    }
  };

        return (
            <div className="participants-section container">
              <div className="row">
                {/* Partecipanti */}
                <div className="col-12">
                  <Card title="Partecipanti" className="participants-card">
                    <div className="row">
                      {trip.participants.map((participant) => (
                        <div key={participant.user._id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
                          <Card
                            className="participant-card"
                            actions={
                              user._id === trip.organizer._id &&
                              participant.status === 'accepted' &&
                              participant.user._id !== user._id
                                ? [
                                    <Tooltip title="Rimuovi">
                                      <Popconfirm
                                        title="Sei sicuro di voler rimuovere questo partecipante?"
                                        onConfirm={() => handleRemoveParticipant(participant.user._id)}
                                        okText="Sì"
                                        cancelText="No"
                                      >
                                        <DeleteOutlined key="delete" />
                                      </Popconfirm>
                                    </Tooltip>,
                                  ]
                                : []
                            }
                          >
                            <Card.Meta
                              avatar={
                                <Avatar
                                  src={participant.user.profileImage}
                                  icon={<UserOutlined />}
                                  size={64}
                                />
                              }
                              title={
                                <>
                                  {participant.user.name || participant.user.email}{' '}
                                  {participant.user._id === trip.organizer._id && (
                                    <CrownOutlined className="organizer-icon" />
                                  )}
                                </>
                              }
                              description={`Status: ${participant.status}`}
                            />
                          </Card>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
        
                {/* Invita un partecipante */}
                {user._id === trip.organizer._id && (
                  <div className="col-12 col-md-4">
                    <Card className="invite-card">
                      <Form layout="inline" onFinish={handleInviteUser}>
                        <Form.Item>
                          <Input
                            prefix={<MailOutlined />}
                            value={emailToInvite}
                            onChange={(e) => setEmailToInvite(e.target.value)}
                            placeholder="Email partecipante"
                            required
                          />
                        </Form.Item>
                        <Form.Item>
                          <Button type="primary" htmlType="submit">
                            Invita
                          </Button>
                        </Form.Item>
                      </Form>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          );
        };

export default ParticipantsSection;
