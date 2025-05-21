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
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useFinancialStats } from '../../hooks/queries/useFinancialStats';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Daily Revenue">
            <div style={{ width: '100%', height: 300 }}>
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
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Payment Channel Distribution">
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data.paymentChannels}
                    dataKey="amount"
                    nameKey="channel"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {data.paymentChannels.map((entry, index) => (
                      <Cell
                        key={entry.channel}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="Peak Hours">
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={data.hourlyTransactions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" tickFormatter={(hour) => `${hour}:00`} />
              <YAxis />
              <Tooltip
                labelFormatter={(hour) => `${hour}:00`}
                formatter={(value, name) => [
                  name === 'count'
                    ? `${value} transactions`
                    : `${value.toLocaleString()}`,
                  name === 'count' ? 'Transaction Count' : 'Transaction Volume',
                ]}
              />
              <Bar dataKey="count" fill="#8884d8" name="Transaction Count" />
              <Bar dataKey="amount" fill="#82ca9d" name="Transaction Amount" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </Space>
  );
};
