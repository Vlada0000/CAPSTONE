import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import http from 'http';

import userRoutes from './routes/usersRoutes.js';
import tripRoutes from './routes/tripsRoutes.js';
import expenseRoutes from './routes/expensesRoutes.js';
import itineraryRoutes from './routes/itinerariesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import messageRoutes from './routes/messagesRoutes.js';

import errorHandler from './middlewares/errorHandler.js';
import { initSocket } from './config/socket.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(helmet());
app.use(morgan('dev'));

const allowlist = [process.env.FRONTEND_URL];
const corsOptionsDelegate = (req, callback) => {
  const corsOptions = allowlist.includes(req.header('Origin')) ? { origin: true } : { origin: false };
  callback(null, corsOptions);
};

app.use(cors({ corsOptionsDelegate }));
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connesso'))
  .catch((err) => console.error('Errore di connessione a MongoDB:', err));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/itineraries', itineraryRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint non trovato' });
});

app.use(errorHandler);

initSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server in esecuzione sulla porta ${PORT}`));
