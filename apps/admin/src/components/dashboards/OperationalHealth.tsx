import React from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Progress,
  Space,
  List,
  Tag,
} from 'antd';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  CheckCircleOutlined,
  WarningOutlined,
  UserOutlined,
  AlertOutlined,
} from '@ant-design/icons';
import { useOperationalHealth } from '../../hooks/queries/useOperationalHealth';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const OperationalHealth: React.FC = () => {
  const { data, isLoading } = useOperationalHealth();

  if (!data) {
    return (
      <Card loading={isLoading}>
        <h2>Operational Health</h2>
        <p>No data available</p>
      </Card>
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* System Status Section */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={6}>
          <Card>
            <Statistic
              title="Active Gaming Machines"
              value={data.systemStatus.activeMachines}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={6}>
          <Card>
            <Statistic
              title="Machines Needing Maintenance"
              value={data.systemStatus.maintenanceNeeded}
              prefix={<WarningOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={6}>
          <Card>
            <Statistic
              title="Active Sessions"
              value={data.realTimeData.activeSessions}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={6}>
          <Card>
            <Statistic
              title="Error Rate Today"
              value={
                data.systemStatus.errorRates[
                  data.systemStatus.errorRates.length - 1
                ].errors
              }
              prefix={<AlertOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
              suffix="errors"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Software Version Distribution */}
        <Col xs={24} lg={12}>
          <Card title="Software Version Distribution">
            <div style={{ height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data.systemStatus.softwareVersions}
                    dataKey="count"
                    nameKey="version"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {data.systemStatus.softwareVersions.map((entry, index) => (
                      <Cell
                        key={entry.version}
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

        {/* Error Rate Monitoring */}
        <Col xs={24} lg={12}>
          <Card title="Error Rate Trend">
            <div style={{ height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={data.systemStatus.errorRates}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="errors"
                    stroke="#ff4d4f"
                    name="Errors"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Machine Occupancy Rates */}
        <Col xs={24} lg={12}>
          <Card title="Machine Occupancy Rates">
            <Table
              dataSource={data.realTimeData.occupancyRates}
              columns={[
                { title: 'Location', dataIndex: 'location', key: 'location' },
                {
                  title: 'Occupancy Rate',
                  dataIndex: 'occupancy',
                  key: 'occupancy',
                  render: (value: number) => (
                    <Progress
                      percent={value}
                      size="small"
                      status={value > 90 ? 'exception' : 'normal'}
                    />
                  ),
                },
                {
                  title: 'Active/Total',
                  key: 'ratio',
                  render: (_, record: any) =>
                    `${Math.floor((record.occupancy * record.totalMachines) / 100)}/${record.totalMachines}`,
                },
              ]}
              pagination={false}
            />
          </Card>
        </Col>

        {/* Live Transaction Feed */}
        <Col xs={24} lg={12}>
          <Card title="Live Transaction Feed">
            <List
              dataSource={data.realTimeData.recentTransactions}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={`Transaction ${item.id}`}
                    description={new Date(item.time).toLocaleString()}
                  />
                  <Space>
                    <Tag color={item.type === 'Coin-In' ? 'green' : 'blue'}>
                      {item.type}
                    </Tag>
                    <span>₱{item.amount.toLocaleString()}</span>
                    <Tag color="purple">{item.machineId}</Tag>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </Space>
  );
};
