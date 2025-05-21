import React from 'react';
import { Card, Row, Col, Table, Space, Progress, Radio } from 'antd';
import { useMachineAnalytics } from '../../hooks/queries/useMachineAnalytics';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884d8',
  '#82ca9d',
];

export const GamingMachinesAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = React.useState(7);
  const { data, isLoading } = useMachineAnalytics(timeRange);

  if (!data) {
    return (
      <Card loading={isLoading}>
        <h2>Gaming Machines Analytics</h2>
        <p>No data available</p>
      </Card>
    );
  }

  const topMachinesColumns = [
    { title: 'Location', dataIndex: 'location', key: 'location' },
    { title: 'Model', dataIndex: 'model', key: 'model' },
    {
      title: 'Volume',
      dataIndex: 'coinInVolume',
      key: 'coinInVolume',
      render: (val: number) => `₱${val.toLocaleString()}`,
      sorter: (a: any, b: any) => a.coinInVolume - b.coinInVolume,
    },
    {
      title: 'Utilization',
      dataIndex: 'utilizationRate',
      key: 'utilizationRate',
      render: (val: number) => (
        <Progress
          percent={Math.round(val * 100)}
          size="small"
          format={(percent) => `${percent}%`}
        />
      ),
    },
  ];

  const locationData = Object.entries(data.locationAnalytics).map(
    ([location, stats]) => ({
      name: location,
      volume: stats.totalVolume,
      machines: stats.machineCount,
      utilization: stats.avgUtilization,
    }),
  );

  const locationBarChart = locationData.map((loc) => ({
    name: loc.name,
    Volume: loc.volume,
    Machines: loc.machines * 1000, // Scale for visualization
  }));

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row gutter={[16, 16]} className="mb-4">
        <Col span={24}>
          <Radio.Group
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value={7}>7 Days</Radio.Button>
            <Radio.Button value={30}>30 Days</Radio.Button>
            <Radio.Button value={90}>90 Days</Radio.Button>
          </Radio.Group>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Top Performing Machines" className="h-full">
            <Table
              dataSource={data.topMachines}
              columns={topMachinesColumns}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Popular Game Types" className="h-full">
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data.gameTypePopularity}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {data.gameTypePopularity.map((entry, index) => (
                      <Cell
                        key={entry.type}
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

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Location Performance">
            <div style={{ width: '100%', height: 400 }}>
              <ResponsiveContainer>
                <BarChart data={locationBarChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip
                    formatter={(value, name) => [
                      name === 'Volume'
                        ? `₱${Number(value).toLocaleString()}`
                        : Math.round(Number(value) / 1000),
                      name === 'Volume' ? 'Volume' : 'Machine Count',
                    ]}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="Volume"
                    fill="#8884d8"
                    name="Volume"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="Machines"
                    fill="#82ca9d"
                    name="Machines"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card title="Machine Status Distribution" className="h-full">
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data.machineMetrics.reduce((acc, machine) => {
                      const status =
                        machine.utilizationRate > 0.7
                          ? 'High'
                          : machine.utilizationRate > 0.3
                            ? 'Medium'
                            : 'Low';
                      const existing = acc.find((item) => item.name === status);
                      if (existing) {
                        existing.value++;
                      } else {
                        acc.push({ name: status, value: 1 });
                      }
                      return acc;
                    }, [] as any[])}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {data.machineMetrics
                      .reduce((acc, machine) => {
                        const status =
                          machine.utilizationRate > 0.7
                            ? 'High'
                            : machine.utilizationRate > 0.3
                              ? 'Medium'
                              : 'Low';
                        if (!acc.find((item) => item.name === status)) {
                          acc.push({ name: status });
                        }
                        return acc;
                      }, [] as any[])
                      .map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={
                            entry.name === 'High'
                              ? '#52c41a'
                              : entry.name === 'Medium'
                                ? '#faad14'
                                : '#ff4d4f'
                          }
                        />
                      ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card title="Machine Balance Trends" className="h-full">
            <Table
              dataSource={data.machineMetrics
                .sort((a, b) => b.currentBalance - a.currentBalance)
                .slice(0, 5)}
              columns={[
                { title: 'Location', dataIndex: 'location', key: 'location' },
                { title: 'Model', dataIndex: 'model', key: 'model' },
                {
                  title: 'Current Balance',
                  dataIndex: 'currentBalance',
                  key: 'currentBalance',
                  render: (val: number) => `₱${val.toLocaleString()}`,
                },
              ]}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </Space>
  );
};
