import React from 'react';
import { Card, Row, Col, Statistic, Table, Progress, Space } from 'antd';
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
  TrophyOutlined,
  RiseOutlined,
  UsergroupAddOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import { useLoyaltyProgram } from '../../hooks/queries/useLoyaltyProgram';

const TIER_COLORS = {
  Diamond: '#1890ff',
  Platinum: '#722ed1',
  Gold: '#faad14',
  Silver: '#bfbfbf',
  Bronze: '#d48806',
};

export const LoyaltyProgram: React.FC = () => {
  const { data, isLoading } = useLoyaltyProgram();

  if (!data) {
    return (
      <Card loading={isLoading}>
        <h2>Loyalty Program</h2>
        <p>No data available</p>
      </Card>
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* Program Metrics Overview */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={6}>
          <Card>
            <Statistic
              title="Total Points Awarded"
              value={data.programMetrics.points.awarded}
              prefix={<TrophyOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={6}>
          <Card>
            <Statistic
              title="Total Points Redeemed"
              value={data.programMetrics.points.redeemed}
              prefix={<RiseOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={6}>
          <Card>
            <Statistic
              title="New Members (7d)"
              value={data.programMetrics.membershipGrowth.reduce(
                (sum, day) => sum + day.newMembers,
                0,
              )}
              prefix={<UsergroupAddOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={6}>
          <Card>
            <Statistic
              title="Overall Retention Rate"
              value={
                data.programMetrics.retentionRates.reduce(
                  (acc, tier) =>
                    acc + (tier.activePlayers / tier.totalPlayers) * 100,
                  0,
                ) / data.programMetrics.retentionRates.length
              }
              prefix={<HeartOutlined style={{ color: '#eb2f96' }} />}
              valueStyle={{ color: '#eb2f96' }}
              suffix="%"
              precision={1}
            />
          </Card>
        </Col>
      </Row>

      {/* Points and Membership Trends */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Points Activity (Last 7 Days)">
            <div style={{ height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={data.programMetrics.points.dateRange}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="awarded"
                    stroke="#faad14"
                    name="Points Awarded"
                  />
                  <Line
                    type="monotone"
                    dataKey="redeemed"
                    stroke="#52c41a"
                    name="Points Redeemed"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Member Growth Trend">
            <div style={{ height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={data.programMetrics.membershipGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="totalMembers"
                    stroke="#1890ff"
                    name="Total Members"
                  />
                  <Line
                    type="monotone"
                    dataKey="newMembers"
                    stroke="#52c41a"
                    name="New Members"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Tier Analysis */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Tier Distribution">
            <div style={{ height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data.memberAnalysis.tierDistribution}
                    dataKey="count"
                    nameKey="tier"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {data.memberAnalysis.tierDistribution.map((entry) => (
                      <Cell
                        key={entry.tier}
                        fill={
                          TIER_COLORS[entry.tier as keyof typeof TIER_COLORS]
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

        <Col xs={24} lg={12}>
          <Card title="Points Economy">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Statistic
                title="Total Points in Circulation"
                value={data.memberAnalysis.pointsEconomy.totalPointsCirculating}
                groupSeparator=","
              />
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Monthly Points Awarded"
                    value={
                      data.memberAnalysis.pointsEconomy.monthlyPointsAwarded
                    }
                    valueStyle={{ color: '#faad14' }}
                    groupSeparator=","
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Monthly Points Redeemed"
                    value={
                      data.memberAnalysis.pointsEconomy.monthlyPointsRedeemed
                    }
                    valueStyle={{ color: '#52c41a' }}
                    groupSeparator=","
                  />
                </Col>
              </Row>
              <Statistic
                title="Average Points per Member"
                value={data.memberAnalysis.pointsEconomy.averagePointsPerMember}
                groupSeparator=","
              />
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Member Engagement and Retention */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Member Engagement Scores">
            <Table
              dataSource={data.memberAnalysis.engagement}
              columns={[
                { title: 'Tier', dataIndex: 'tier', key: 'tier' },
                {
                  title: 'Engagement Score',
                  dataIndex: 'averageScore',
                  key: 'score',
                  render: (score: number) => (
                    <Progress
                      percent={score * 10}
                      size="small"
                      format={(percent) =>
                        percent ? (percent / 10).toFixed(1) : '0'
                      }
                    />
                  ),
                },
                {
                  title: 'Visit Frequency',
                  dataIndex: ['metrics', 'visitFrequency'],
                  key: 'visits',
                  render: (val: number) => `${val.toFixed(1)}/month`,
                },
                {
                  title: 'Redemption Rate',
                  dataIndex: ['metrics', 'redemptionRate'],
                  key: 'redemption',
                  render: (val: number) => `${(val * 100).toFixed(0)}%`,
                },
              ]}
              pagination={false}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Retention Rates by Tier">
            <Table
              dataSource={data.programMetrics.retentionRates}
              columns={[
                { title: 'Tier', dataIndex: 'tier', key: 'tier' },
                {
                  title: 'Retention Rate',
                  dataIndex: 'rate',
                  key: 'rate',
                  render: (rate: number) => (
                    <Progress
                      percent={rate * 100}
                      size="small"
                      status={
                        rate >= 0.9
                          ? 'success'
                          : rate >= 0.7
                            ? 'normal'
                            : 'exception'
                      }
                    />
                  ),
                },
                {
                  title: 'Active/Total',
                  key: 'ratio',
                  render: (_, record: any) =>
                    `${record.activePlayers}/${record.totalPlayers}`,
                },
              ]}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </Space>
  );
};
