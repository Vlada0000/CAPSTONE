// src/components/Expenses/ExpenseDashboard.jsx
import React, { useState, useEffect } from 'react';
import { calculateSplit } from '../../api/expenseApi';
import { useAuth } from '../../context/authContext';
import { Layout, Spin, Alert, Row, Col, Card, Typography } from 'antd';
import { useParams } from 'react-router-dom';

import ExpensePieChart from './ExpensePieChart';
import ExpenseTable from './ExpenseTable';
import TotalExpensesCard from './TotalExpensesCard';
import './ExpenseDashboard.css';

const { Content } = Layout;
const { Title } = Typography;

const ExpenseDashboard = () => {
  const { user } = useAuth();
  const { tripId } = useParams();
  const [splitResults, setSplitResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [balances, setBalances] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);

  useEffect(() => {
    const fetchSplit = async () => {
      try {
        const splitData = await calculateSplit(tripId, user.token);
        setSplitResults(splitData.transactions || []);
        setTotalExpenses(splitData.totalExpenses || 0);
        setBalances(splitData.balances || []);

        if (splitData.participants && Array.isArray(splitData.participants)) {
          const chartData = splitData.participants.map((p) => ({
            name: p.user.name,
            value: Math.abs(splitData.balances[p.user._id] || 0),
          }));
          setPieChartData(chartData);
        } else {
          console.error('Partecipanti mancanti o non in formato array');
          setPieChartData([]);
        }

        setLoading(false);
      } catch (error) {
        console.error('Errore nel calcolo della suddivisione:', error);
        setError('Errore nel calcolo della suddivisione');
        setLoading(false);
      }
    };

    fetchSplit();
  }, [tripId, user.token]);

  if (loading) {
    return (
      <div className="expense-dashboard-loading">
        <Spin size="large" />
        <p>Caricamento dati delle spese...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="expense-dashboard-error">
        <Alert message="Errore" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <Layout className="expense-dashboard-layout">
      <Content className="expense-dashboard-content">
        <Title level={2} className="dashboard-title">
          Dashboard Spese
        </Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card className="expense-dashboard-card">
              <ExpenseTable data={splitResults} />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card className="expense-dashboard-card">
              <ExpensePieChart data={pieChartData} />
            </Card>
            <TotalExpensesCard total={totalExpenses} />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default ExpenseDashboard;
