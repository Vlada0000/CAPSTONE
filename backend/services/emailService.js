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

export const sendProfileDeletionEmail = async (userEmail, userName) => {
  try {
    const subject = 'Conferma eliminazione del profilo';
    const text = `Ciao ${userName},\n\nIl tuo profilo è stato eliminato con successo. Se hai domande o necessiti di assistenza, non esitare a contattarci.`;
    const html = `<strong>Ciao ${userName},</strong><br/><br/>Il tuo profilo è stato eliminato con successo. Se hai domande o necessiti di assistenza, non esitare a contattarci.`;

    await sendEmail({ to: userEmail, subject, text, html });
    console.log('Email di conferma eliminazione del profilo inviata con successo');
  } catch (error) {
    console.error('Errore nell\'invio dell\'email di conferma eliminazione del profilo:', error);
  }
};

  