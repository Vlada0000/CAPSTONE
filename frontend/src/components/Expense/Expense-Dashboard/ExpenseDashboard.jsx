import { useState, useEffect } from 'react';
import { calculateSplit } from '../../../api/expenseApi';
import { useAuth } from '../../../context/authContext';
import { Layout, Spin, Alert, Row, Col, Card, Typography, Button } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons'; 

import ExpensePieChart from '../Expense-PieChart/ExpensePieChart';
import ExpenseTable from '../Expense-Table/ExpenseTable';
import TotalExpensesCard from '../Total-Expense-Card/TotalExpensesCard';
import './ExpenseDashboard.css';

const { Content } = Layout;
const { Title } = Typography;

const ExpenseDashboard = () => {
  const { user } = useAuth();
  const { tripId } = useParams();
  const navigate = useNavigate(); 

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
  
        if (Array.isArray(splitData.participants) && splitData.participants.length > 0) {
          const chartData = splitData.participants.map((participant) => {
            const participantName = participant?.name; 
            const participantBalance = splitData.balances[participant._id] || 0;
           
            const type = participantBalance > 0 
              ? 'creditore' 
              : participantBalance < 0 
              ? 'debitore' 
              : ''; 
            
            return {
              name: type ? `${participantName} (${type})` : participantName, 
              value: Math.abs(participantBalance),  
            };
          });
  
          setPieChartData(chartData);
        } else {
          console.error('Partecipanti mancanti o non in formato array');
          setPieChartData([]);
        }
      } catch (err) {
        console.error('Errore nel calcolo della suddivisione:', err);
        setError('Errore nel calcolo della suddivisione');
      } finally {
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
        <Button
          type="link"
          onClick={() => navigate(-1)} 
          icon={<ArrowLeftOutlined />} 
          className="back-button"
          style={{ marginBottom: '20px' }}
        >
        </Button>

        <Title level={2} className="dashboard-title">Dashboard Spese</Title>
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
