import React from 'react';
import { Tabs } from 'antd';
import {
  DollarOutlined,
  DesktopOutlined,
  TeamOutlined,
  SafetyOutlined,
  DashboardOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import {
  FinancialOverview,
  GamingMachinesAnalytics,
  PlayerAnalytics,
  RiskManagement,
  OperationalHealth,
  LoyaltyProgram,
} from '../components/dashboards';

const Dashboard: React.FC = () => {
  const items = [
    {
      key: '1',
      label: (
        <span>
          <DollarOutlined /> Financial Overview
        </span>
      ),
      children: <FinancialOverview />,
    },
    {
      key: '2',
      label: (
        <span>
          <DesktopOutlined /> Gaming Machines
        </span>
      ),
      children: <GamingMachinesAnalytics />,
    },
    {
      key: '3',
      label: (
        <span>
          <TeamOutlined /> Player Analytics
        </span>
      ),
      children: <PlayerAnalytics />,
    },
    {
      key: '4',
      label: (
        <span>
          <SafetyOutlined /> Risk Management
        </span>
      ),
      children: <RiskManagement />,
    },
    {
      key: '5',
      label: (
        <span>
          <DashboardOutlined /> Operational Health
        </span>
      ),
      children: <OperationalHealth />,
    },
    {
      key: '6',
      label: (
        <span>
          <TrophyOutlined /> Loyalty Program
        </span>
      ),
      children: <LoyaltyProgram />,
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
      <Tabs
        defaultActiveKey="1"
        items={items}
        className="dashboard-tabs"
        size="large"
      />
    </div>
  );
};

export default Dashboard;
