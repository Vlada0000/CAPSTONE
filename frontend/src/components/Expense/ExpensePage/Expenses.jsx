import { useState, useEffect } from 'react';
import { Card, Spin, Alert, Button, Collapse } from 'antd';
import { useAuth } from '../../../context/authContext';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

import { getExpenses, addExpense, updateExpense, deleteExpense } from '../../../api/expenseApi';
import { getParticipants } from '../../../api/tripApi';

import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';

const Expenses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { tripId } = useParams();

  const [participants, setParticipants] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [expenseData, setExpenseData] = useState({
    amount: '',
    description: '',
    date: null,
    paidBy: '',
    participants: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [participantsData, expensesData] = await Promise.all([
          getParticipants(tripId, user.token),
          getExpenses(tripId, user.token),
        ]);

        setParticipants(participantsData);
        setExpenses(expensesData);
      } catch (error) {
        setError('Errore nel recupero dei dati');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tripId, user.token]);

  const handleAddExpense = async () => {
    try {
      const newExpense = {
        ...expenseData,
        trip: tripId,
        date: expenseData.date ? expenseData.date.format('YYYY-MM-DD') : null,
      };
      const addedExpense = await addExpense(newExpense, user.token);
      setExpenses([...expenses, addedExpense]);
      resetForm();
    } catch (error) {
      setError("Errore durante l'aggiunta della spesa");
    }
  };

  const handleUpdateExpense = async () => {
    try {
      const updatedExpenseData = {
        ...expenseData,
        date: expenseData.date ? expenseData.date.format('YYYY-MM-DD') : null,
      };
      const updatedExpense = await updateExpense(expenseData._id, updatedExpenseData, user.token);
      setExpenses(expenses.map((exp) => (exp._id === expenseData._id ? updatedExpense : exp)));
      resetForm();
    } catch (error) {
      setError("Errore durante l'aggiornamento della spesa");
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await deleteExpense(id, user.token);
      setExpenses(expenses.filter((exp) => exp._id !== id));
    } catch (error) {
      setError("Errore durante l'eliminazione della spesa");
    }
  };

  const startEditingExpense = (expense) => {
    setExpenseData({
      ...expense,
      date: expense.date ? moment(expense.date) : null,
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setExpenseData({
      amount: '',
      description: '',
      date: null,
      paidBy: '',
      participants: [],
    });
    setIsEditing(false);
  };

  const goToExpenseDashboard = () => {
    navigate(`/trips/${tripId}/expenses/dashboard`);
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert message="Errore" description={error} type="error" showIcon />;
  }

  const collapseItems = [
    {
      key: '1',
      label: isEditing ? 'Modifica Spesa' : 'Aggiungi Nuova Spesa',
      children: (
        <ExpenseForm
          participants={participants}
          expenseData={expenseData}
          setExpenseData={setExpenseData}
          onSubmit={isEditing ? handleUpdateExpense : handleAddExpense}
          onCancel={resetForm}
          isEditing={isEditing}
        />
      ),
    },
  ];

  return (
    <Card title="Gestisci Spese" style={{ marginBottom: '20px' }}>
      {/* Form in Collapse */}
      <Collapse items={collapseItems} />

      {/* Lista delle spese */}
      <ExpenseList
        expenses={expenses}
        participants={participants}
        onEdit={startEditingExpense}
        onDelete={handleDeleteExpense}
      />

      <Button type="default" size="large" onClick={goToExpenseDashboard} style={{ marginTop: '20px' }}>
        Vai alla Dashboard delle Spese
      </Button>
    </Card>
  );
};

export default Expenses;
