import React, { useState, useEffect } from 'react';
import { Table, Input, Card, Space, Select, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { BanknotesIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { cashInService } from '../../services/cashInService';
import type { CashIn } from '../../types/CashIn';
import { CashInChannel } from '../../types/CashIn';

const channelLabels = {
  [CashInChannel.GCASH]: 'GCash',
};

const CashInsList: React.FC = () => {
  const [cashIns, setCashIns] = useState<CashIn[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    channel: '',
  });
  const navigate = useNavigate();

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => id.slice(-6),
    },
    {
      title: 'User',
      key: 'user',
      render: (record: CashIn) => (
        <span>
          {[record.user.firstName, record.user.lastName]
            .filter(Boolean)
            .join(' ') || record.user.mobileNumber}
        </span>
      ),
    },
    {
      title: 'Channel',
      dataIndex: 'channel',
      key: 'channel',
      render: (channel: CashInChannel) => (
        <Tag color="blue">{channelLabels[channel]}</Tag>
      ),
    },
    {
      title: 'Amount',
      key: 'amount',
      render: (record: CashIn) => (
        <span>₱{record.amount.toLocaleString()}</span>
      ),
    },
    {
      title: 'Ending Balance',
      key: 'endingBalance',
      render: (record: CashIn) => (
        <span>₱{record.endingBalance.toLocaleString()}</span>
      ),
    },
    {
      title: 'Timestamp',
      key: 'timestamp',
      render: (record: CashIn) => (
        <span>{new Date(record.timestamp).toLocaleString()}</span>
      ),
    },
  ];

  useEffect(() => {
    fetchCashIns();
  }, [search, filters.channel]);

  const fetchCashIns = async () => {
    setLoading(true);
    try {
      const data = await cashInService.getCashIns(search);
      let filteredData = data;

      // Apply filters
      if (filters.channel) {
        filteredData = filteredData.filter(
          (ci: CashIn) => ci.channel === filters.channel,
        );
      }

      setCashIns(filteredData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <BanknotesIcon className="h-7 w-7 mr-2 text-primary" />
          Cash-in Transactions
        </h1>
      </div>

      <Card>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Input
            placeholder="Search by user name, mobile number, or reference ID..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-2"
          />

          <div className="flex flex-wrap gap-4">
            <Select
              placeholder="Filter by Channel"
              allowClear
              style={{ width: 200 }}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, channel: value || '' }))
              }
            >
              {Object.entries(channelLabels).map(([value, label]) => (
                <Select.Option key={value} value={value}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          </div>

          <Table
            columns={columns}
            dataSource={cashIns}
            loading={loading}
            rowKey="id"
            onRow={(record) => ({
              onClick: () => navigate(`/cash-ins/${record.id}`),
              style: { cursor: 'pointer' },
            })}
          />
        </Space>
      </Card>
    </div>
  );
};

export default CashInsList;
