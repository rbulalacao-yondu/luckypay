import React, { useState, useEffect } from 'react';
import { Table, Input, Card, Space, Tag, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { UsersIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { playerService } from '../../services/playerService';
import type { User } from '../../types/User';
import { UserStatus, LoyaltyTier } from '../../types/User';

const statusColors = {
  [UserStatus.ACTIVE]: 'green',
  [UserStatus.INACTIVE]: 'gray',
  [UserStatus.SUSPENDED]: 'red',
  [UserStatus.PENDING_VERIFICATION]: 'orange',
};

const loyaltyTierColors = {
  [LoyaltyTier.BRONZE]: '#CD7F32',
  [LoyaltyTier.SILVER]: '#C0C0C0',
  [LoyaltyTier.GOLD]: '#FFD700',
  [LoyaltyTier.PLATINUM]: '#E5E4E2',
};

const PlayersList: React.FC = () => {
  const [players, setPlayers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    loyaltyTier: '',
  });
  const navigate = useNavigate();

  // Get unique values for filters
  const statuses = Object.values(UserStatus);
  const loyaltyTiers = Object.values(LoyaltyTier);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: number) => String(id).padStart(6, '0'),
    },
    {
      title: 'Name',
      key: 'name',
      render: (record: User) => (
        <span>
          {[record.firstName, record.lastName].filter(Boolean).join(' ') || '-'}
        </span>
      ),
    },
    { title: 'Mobile', dataIndex: 'mobileNumber', key: 'mobileNumber' },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email?: string) => email || '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: UserStatus) => (
        <Tag color={statusColors[status]}>
          {status.replace(/_/g, ' ').toLowerCase()}
        </Tag>
      ),
    },
    {
      title: 'Loyalty',
      key: 'loyalty',
      render: (record: User) => (
        <Space direction="vertical" size="small">
          <Tag
            color={loyaltyTierColors[record.loyaltyTier]}
            style={{ color: 'black' }}
          >
            {record.loyaltyTier}
          </Tag>
          <span>{record.loyaltyPoints.toLocaleString()} points</span>
        </Space>
      ),
    },
    {
      title: 'Wallet Balance',
      dataIndex: 'walletBalance',
      key: 'walletBalance',
      render: (balance: number) => <span>₱{balance.toLocaleString()}</span>,
    },
  ];

  useEffect(() => {
    fetchPlayers();
  }, [search, filters.status, filters.loyaltyTier]);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const data = await playerService.getPlayers(search);
      let filteredData = data;

      // Apply filters
      if (filters.status) {
        filteredData = filteredData.filter(
          (p: User) => p.status === filters.status,
        );
      }
      if (filters.loyaltyTier) {
        filteredData = filteredData.filter(
          (p: User) => p.loyaltyTier === filters.loyaltyTier,
        );
      }

      setPlayers(filteredData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <UsersIcon className="h-7 w-7 mr-2 text-primary" />
          Casino Players
        </h1>
      </div>

      <Card>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Input
            placeholder="Search players by name, mobile, or email..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-2"
          />

          <div className="flex flex-wrap gap-4">
            <Select
              placeholder="Filter by Status"
              allowClear
              style={{ width: 200 }}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, status: value || '' }))
              }
            >
              {statuses.map((status) => (
                <Select.Option key={status} value={status}>
                  {status.replace(/_/g, ' ').toLowerCase()}
                </Select.Option>
              ))}
            </Select>

            <Select
              placeholder="Filter by Loyalty Tier"
              allowClear
              style={{ width: 200 }}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, loyaltyTier: value || '' }))
              }
            >
              {loyaltyTiers.map((tier) => (
                <Select.Option key={tier} value={tier}>
                  {tier}
                </Select.Option>
              ))}
            </Select>
          </div>

          <Table
            columns={columns}
            dataSource={players}
            loading={loading}
            rowKey="id"
            onRow={(record) => ({
              onClick: () => navigate(`/players/${record.id}`),
              style: { cursor: 'pointer' },
            })}
          />
        </Space>
      </Card>
    </div>
  );
};

export default PlayersList;
