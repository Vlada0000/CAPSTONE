import { sendEmail } from '../utils/sendEmails.js' // Adjust the path if necessary


export const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const subject = 'Benvenuto nel nostro servizio!';
    const text = `Ciao ${userName},\n\nGrazie per esserti registrato. Siamo entusiasti di averti con noi!`;
    const html = `<strong>Ciao ${userName},</strong><br/><br/>Grazie per esserti registrato. Siamo entusiasti di averti con noi!`;

    await sendEmail({
      to: userEmail,
      subject,
      text,
      html,
    });
    console.log('Email di benvenuto inviata con successo');
  } catch (error) {
    console.error('Errore nell\'invio dell\'email di benvenuto:', error);
  }
};

export const sendTripAcceptanceEmail = async (organizerEmail, organizerName, inviteeName) => {
  try {
    const subject = 'Trip Invitation Accepted';
    const text = `Hello ${organizerName},\n\nGood news! ${inviteeName} has accepted your invitation to join the trip.`;
    const html = `<strong>Hello ${organizerName},</strong><br/><br/>Good news! ${inviteeName} has accepted your invitation to join the trip.`;

    await sendEmail({
      to: organizerEmail,
      subject,
      text,
      html,
    });
    console.log('Trip acceptance email sent successfully');
  } catch (error) {
    console.error('Failed to send trip acceptance email:', error);
  }
};