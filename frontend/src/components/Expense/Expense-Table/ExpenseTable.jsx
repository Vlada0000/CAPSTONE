import { Table, Typography } from 'antd';
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
    </div>
  );
};

export default ExpenseTable;
