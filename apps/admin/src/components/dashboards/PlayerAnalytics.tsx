import React from 'react';
import { Card, Row, Col, Table, Space, Radio } from 'antd';
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
  LineChart,
  Line,
} from 'recharts';
import { usePlayerAnalytics } from '../../hooks/queries/usePlayerAnalytics';

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884d8',
  '#82ca9d',
];

export const PlayerAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = React.useState(7);
  const { data, isLoading } = usePlayerAnalytics(timeRange);

  if (!data) {
    return (
      <Card loading={isLoading}>
        <h2>Player Analytics</h2>
        <p>No data available</p>
      </Card>
    );
  }

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

      {/* Player Segments Section */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Loyalty Tier Distribution">
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data.loyaltyDistribution}
                    dataKey="count"
                    nameKey="tier"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {data.loyaltyDistribution.map((entry, index) => (
                      <Cell
                        key={entry.tier}
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

        <Col xs={24} lg={12}>
          <Card title="Active Players Trend">
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={data.activePlayers}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#8884d8"
                    name="Active Players"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="New vs Returning Players">
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data.playerSegments}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    <Cell fill="#0088FE" />
                    <Cell fill="#00C49F" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Top Players by Volume">
            <Table
              dataSource={data.topPlayers}
              rowKey="id"
              columns={[
                {
                  title: 'ID',
                  dataIndex: 'id',
                  key: 'id',
                  render: (id) => String(id).padStart(6, '0'),
                },
                { title: 'Name', dataIndex: 'name', key: 'name' },
                {
                  title: 'Volume',
                  dataIndex: 'volume',
                  key: 'volume',
                  render: (val) => (val ? `₱${val.toLocaleString()}` : '-'),
                },
                {
                  title: 'Loyalty Tier',
                  dataIndex: 'loyaltyTier',
                  key: 'loyaltyTier',
                },
              ]}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* Player Behavior Section */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Average Bet Sizes">
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={data.betSizes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" name="Players" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Preferred Game Types">
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data.gamePreferences}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {data.gamePreferences.map((entry, index) => (
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
        <Col xs={24} lg={12}>
          <Card title="Playing Patterns (Time of Day)">
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={data.timeOfDayActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="hour"
                    tickFormatter={(hour) => `${hour}:00`}
                  />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip
                    labelFormatter={(hour) => `${hour}:00`}
                    formatter={(value, name) => [
                      name === 'players'
                        ? `${value} players`
                        : `₱${Number(value).toLocaleString()}`,
                      name === 'players' ? 'Active Players' : 'Volume',
                    ]}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="players"
                    fill="#8884d8"
                    name="players"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="volume"
                    fill="#82ca9d"
                    name="volume"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </Space>
  );
};
