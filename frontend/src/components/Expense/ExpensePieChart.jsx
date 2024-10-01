// src/components/Expenses/ExpensePieChart.jsx
import React from 'react';
import { Pie } from '@ant-design/plots';
import { Typography } from 'antd';
import './ExpensePieChart.css';

const { Title } = Typography;

const ExpensePieChart = ({ data }) => {
  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'name',
    radius: 1,
    innerRadius: 0.6,
    // Rimozione temporanea delle etichette
    label: null,
    interactions: [{ type: 'element-active' }],
    legend: {
      position: 'bottom',
    },
  };

  return (
    <div className="expense-pie-chart">
      <Title level={3} className="chart-title">
        Suddivisione Spese
      </Title>
      <Pie {...config} />
    </div>
  );
};

export default ExpensePieChart;
