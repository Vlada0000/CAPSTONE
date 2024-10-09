import { Table, Typography, Card, List } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './ExpenseTable.css';

const { Title } = Typography;

const ExpenseTable = ({ data }) => {
  const columns = [
    {
      title: 'Debitore',
      dataIndex: 'from',
      key: 'from',
      render: (debtor) => (
        <>
          <UserOutlined /> {debtor?.name} {debtor?.surname}
        </>
      ),
    },
    {
      title: 'Creditore',
      dataIndex: 'to',
      key: 'to',
      render: (creditor) => (
        <>
          <UserOutlined /> {creditor?.name} {creditor?.surname}
        </>
      ),
    },
    {
      title: 'Importo Dovuto',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `€ ${amount.toFixed(2)}`,
    },
  ];

  return (
    <div className="expense-table">
      <Title level={3} className="table-title">
        Dettagli delle Transazioni
      </Title>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey={(record) => `${record.from._id}-${record.to._id}-${record.amount}`}
      />
      <List
        className="expense-list"
        grid={{ gutter: 16, column: 1 }}
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <Card className="expense-card">
              <p>
                <strong>Debitore:</strong> {item.from.name} {item.from.surname}
              </p>
              <p>
                <strong>Creditore:</strong> {item.to.name} {item.to.surname}
              </p>
              <p>
                <strong>Importo Dovuto:</strong> € {item.amount.toFixed(2)}
              </p>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default ExpenseTable;
