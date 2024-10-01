import Expense from '../models/Expense.js';
import Trip from '../models/Trip.js'; 
import { emitGlobalEvent } from '../config/socket.js'; 
import Notification from '../models/Notification.js';
// Aggiungere una nuova spesa
export const addExpense = async (req, res) => {
  const { trip, amount, description, date, paidBy, participants } = req.body;
  const userId = req.user._id.toString();

  try {
    const newExpense = new Expense({
      trip,
      amount,
      description,
      date,
      paidBy,
      participants,
    });

    const savedExpense = await newExpense.save();

    const tripDetails = await Trip.findById(trip).populate('participants.user');

    const notifications = tripDetails.participants
      .filter(({ user }) => user._id.toString() !== userId)
      .map(async ({ user }) => {
        const notification = new Notification({
          recipient: user._id,
          sender: userId,
          type: 'expense_added',
          message: `Una nuova spesa è stata aggiunta.`,
          data: {
            tripId: trip.toString(),
            expenseId: savedExpense._id.toString(),
          },
        });
        await notification.save();

        emitGlobalEvent(
          'notification',
          {
            type: 'expense_added',
            data: {
              tripId: trip.toString(),
              expense: savedExpense,
            },
          },
          user._id.toString()
        );
      });

    await Promise.all(notifications);

    res.status(201).json(savedExpense);
  } catch (error) {
    console.error('Errore durante l\'aggiunta della spesa:', error);
    res.status(500).json({ message: 'Errore del server' });
  }
};




// Ottenere tutte le spese di un viaggio
export const getExpenses = async (req, res) => {
  const { trip } = req.query; 

  if (!trip) {
    return res.status(400).json({ error: 'tripId mancante' });
  }


  const page = parseInt(req.query.page, 10) || 1; // Pagina corrente, default è 1
  const limit = parseInt(req.query.limit, 10) || 10; // Numero di risultati per pagina, default è 10
  const skip = (page - 1) * limit; // Calcola da dove iniziare a saltare i risultati

  try {
   
    const expenses = await Expense.find({ trip })
      .populate('paidBy') // Popola il campo paidBy con i dati dell'utente
      .skip(skip)         // Salta i risultati per la paginazione
      .limit(limit);      // Limita il numero di risultati per pagina

    // Conta il numero totale di spese per la paginazione
    const totalExpenses = await Expense.countDocuments({ trip });

    res.status(200).json({
      expenses,
      totalExpenses,
      totalPages: Math.ceil(totalExpenses / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Errore nel recupero delle spese:', error);
    res.status(500).json({ error: 'Errore del server nel recupero delle spese' });
  }
};


// Ottenere una spesa per ID
export const getExpenseById = async (req, res) => {
  const { id } = req.params;

  try {
    const expense = await Expense.findById(id).populate('paidBy', 'name');
    if (!expense) {
      return res.status(404).json({ error: 'Spesa non trovata' });
    }

    // Verifica se l'utente è partecipante al viaggio associato alla spesa
    const tripDetails = await Trip.findById(expense.trip).populate('participants.user');
    const isParticipant = tripDetails.participants.some(p => p.user.equals(req.user._id));
    if (!isParticipant) {
      return res.status(403).json({ error: 'Non sei autorizzato a vedere questa spesa' });
    }

    res.status(200).json(expense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Aggiornare una spesa esistente
export const updateExpense = async (req, res) => {
  const { id } = req.params;
  const { trip, amount, description, date, paidBy, participants } = req.body;

  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      { trip, amount, description, date, paidBy, participants },
      { new: true, runValidators: true }
    );
    if (!updatedExpense) {
      return res.status(404).json({ error: 'Spesa non trovata' });
    }

    
    const tripDetails = await Trip.findById(updatedExpense.trip).populate('participants.user');

    
    const userId = req.user._id.toString();

    
    const notifications = tripDetails.participants
      .filter(({ user }) => user._id.toString() !== userId)
      .map(async ({ user }) => {
       
        const notification = new Notification({
          recipient: user._id,
          sender: userId,
          type: 'expense_updated',
          message: `Una spesa è stata aggiornata.`,
          data: {
            tripId: updatedExpense.trip.toString(),
            expenseId: updatedExpense._id.toString(),
          },
        });
        await notification.save();

      
        emitGlobalEvent(
          'notification',
          {
            type: 'expense_updated',
            data: {
              tripId: updatedExpense.trip.toString(),
              expense: updatedExpense,
              message: notification.message,
            },
          },
          user._id.toString()
        );
      });

    await Promise.all(notifications); 

    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminare una spesa esistente
export const deleteExpense = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedExpense = await Expense.findByIdAndDelete(id);
    if (!deletedExpense) {
      return res.status(404).json({ error: 'Spesa non trovata' });
    }

    
    const tripDetails = await Trip.findById(deletedExpense.trip).populate('participants.user');
    const userId = req.user._id.toString();

    
    const notifications = tripDetails.participants
      .filter(({ user }) => user._id.toString() !== userId)
      .map(async ({ user }) => {
        
        const notification = new Notification({
          recipient: user._id,
          sender: userId,
          type: 'expense_deleted',
          message: `Una spesa è stata eliminata.`,
          data: {
            tripId: deletedExpense.trip.toString(),
            expenseId: deletedExpense._id.toString(),
          },
        });
        await notification.save();

        
        emitGlobalEvent(
          'notification',
          {
            type: 'expense_deleted',
            data: {
              tripId: deletedExpense.trip.toString(),
              expenseId: deletedExpense._id.toString(),
              message: notification.message,
            },
          },
          user._id.toString()
        );
      });

    await Promise.all(notifications); 

    res.status(200).json({ message: 'Spesa eliminata con successo' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Funzione per suddividere equamente le spese
export const calculateSplit = async (req, res) => {
  const { tripId } = req.params;

  try {
    // Recupera il viaggio e le spese
    const trip = await Trip.findById(tripId).populate('participants.user');
    const expenses = await Expense.find({ trip: tripId });

    if (!trip) {
      return res.status(404).json({ error: 'Viaggio non trovato' });
    }

    // Calcola il totale delle spese
    const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);

    // Quota equa per ciascun partecipante
    const fairShare = totalExpenses / trip.participants.length;

    // Calcola quanto ogni partecipante ha pagato
    const balances = {};
    trip.participants.forEach(p => {
      balances[p.user._id] = 0;
    });

    expenses.forEach(expense => {
      balances[expense.paidBy] += expense.amount;
    });

    // Determina il bilancio di ciascun partecipante
    trip.participants.forEach(p => {
      balances[p.user._id] -= fairShare;
    });

    // Dividi in debitori e creditori
    const creditors = [];
    const debtors = [];

    trip.participants.forEach(p => {
      if (balances[p.user._id] > 0) {
        creditors.push({ user: p.user, amount: balances[p.user._id] });
      } else if (balances[p.user._id] < 0) {
        debtors.push({ user: p.user, amount: -balances[p.user._id] });
      }
    });

    // Genera le transazioni per il rimborso
    const transactions = [];
    let i = 0, j = 0;

    while (i < creditors.length && j < debtors.length) {
      const amountToPay = Math.min(creditors[i].amount, debtors[j].amount);

      transactions.push({
        from: debtors[j].user,
        to: creditors[i].user,
        amount: amountToPay
      });

      creditors[i].amount -= amountToPay;
      debtors[j].amount -= amountToPay;

      if (creditors[i].amount === 0) i++;
      if (debtors[j].amount === 0) j++;
    }

    
    res.status(200).json({
      transactions,
      totalExpenses,
      participants: trip.participants, 
      balances 
    });

  } catch (error) {
    console.error('Errore nel calcolo delle spese:', error);
    res.status(500).json({ message: 'Errore del server nel calcolo delle spese' });
  }
};
