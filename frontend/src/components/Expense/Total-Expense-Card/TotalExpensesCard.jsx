import { Card, Statistic } from 'antd';
import { EuroCircleTwoTone } from '@ant-design/icons';
import './TotalExpensesCard.css';

const TotalExpensesCard = ({ total }) => {
  return (
    <Card className="total-expenses-card">
      <Statistic
        title="Spesa Totale"
        value={total}
        precision={2}
        prefix={<EuroCircleTwoTone twoToneColor="#52c41a" />}
        valueStyle={{ color: '#3f8600' }}
      />
    </Card>
  );
};

export default TotalExpensesCard;
