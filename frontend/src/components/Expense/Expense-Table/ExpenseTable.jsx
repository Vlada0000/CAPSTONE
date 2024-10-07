import { Table, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './ExpenseTable.css';

const { Title } = Typography;

const ExpenseTable = ({ data }) => {
 
  const columns = [
    {
      title: 'Da',
      dataIndex: 'from',
      key: 'from',
      render: (fromUser) => (
        <>
          <UserOutlined /> {fromUser.name} {fromUser.surname}
        </>
      ),
    },
    {
      title: 'A',
      dataIndex: 'to',
      key: 'to',
      render: (toUser) => (
        <>
          <UserOutlined /> {toUser.name} {toUser.surname}
        </>
      ),
    },
    {
      title: 'Importo',
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
        rowKey={(record) => `${record.from._id}-${record.to._id}`} 
      />
    </div>
  );
};

export default ExpenseTable;
