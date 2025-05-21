import React from 'react';
import { Card, Row, Col, Statistic, Space, Spin } from 'antd';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useFinancialStats } from '../../hooks/queries/useFinancialStats';

export const FinancialOverview: React.FC = () => {
  const { data, isLoading } = useFinancialStats();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spin size="large" />
      </div>
    );
  }

  if (!data) {
    return (
      <Card>
        <p>No financial data available</p>
      </Card>
    );
  }
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Transactions Today"
              value={data.totalTransactionsToday}
              prefix=""
              precision={0}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Average Transaction Value"
              value={data.avgTransactionValue}
              prefix="₱"
              precision={2}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Revenue Today"
              value={data.totalRevenueToday}
              prefix="₱"
              precision={2}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Revenue Growth"
              value={data.revenueGrowth}
              precision={2}
              valueStyle={{
                color: data.revenueGrowth >= 0 ? '#3f8600' : '#cf1322',
              }}
              prefix={
                data.revenueGrowth >= 0 ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )
              }
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      <Card title="Daily Revenue">
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <LineChart data={data.dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="coinIns"
                stroke="#8884d8"
                name="Coin-ins"
              />
              <Line
                type="monotone"
                dataKey="cashIns"
                stroke="#82ca9d"
                name="Cash-ins"
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#ff7300"
                name="Total"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </Space>
  );
};
