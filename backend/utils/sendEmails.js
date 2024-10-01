import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv'

dotenv.config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const msg = {
      to,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@example.com',
      subject,
      text,
      html,
    };
    await sgMail.send(msg);
    console.log('Email inviata con successo');
  } catch (error) {
    console.error('Errore nell\'invio dell\'email:', error);
    if (error.response) {
      console.error('Errore nella risposta:', error.response.body);
    }
  }
};
