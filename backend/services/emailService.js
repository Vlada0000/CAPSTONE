import { sendEmail } from '../utils/sendEmails.js'; 

export const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const subject = 'Benvenuto nel nostro servizio!';
    const text = `Ciao ${userName},\n\nGrazie per esserti registrato. Siamo entusiasti di averti con noi!`;
    const html = `<strong>Ciao ${userName},</strong><br/><br/>Grazie per esserti registrato. Siamo entusiasti di averti con noi!`;

    await sendEmail({ to: userEmail, subject, text, html });
    console.log('Email di benvenuto inviata con successo');
  } catch (error) {
    console.error('Errore nell\'invio dell\'email di benvenuto:', error);
  }
};

export const sendTripAcceptanceEmail = async (organizerEmail, organizerName, inviteeName) => {
    try {
      const subject = 'Invito al viaggio accettato';
      const text = `Ciao ${organizerName},\n\nBuone notizie! ${inviteeName} ha accettato il tuo invito a partecipare al viaggio.`;
      const html = `<strong>Ciao ${organizerName},</strong><br/><br/>Buone notizie! ${inviteeName} ha accettato il tuo invito a partecipare al viaggio.`;
  
      await sendEmail({ to: organizerEmail, subject, text, html });
      console.log('Email di accettazione del viaggio inviata con successo');
    } catch (error) {
      console.error('Errore nell\'invio dell\'email di accettazione del viaggio:', error);
    }
  };
  