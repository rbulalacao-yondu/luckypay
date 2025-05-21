import React, { useState, useEffect } from 'react';
import { Table, Input, Card, Space, Tag, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { gamingMachineService } from '../../services/gamingMachineService.ts';
import type { GamingMachine } from '../../types/GamingMachine';
import { MachineStatus } from '../../types/MachineStatus';
import { getMachineStatusColor } from '../../utils/machineStatusUtils';

const GamingMachineList: React.FC = () => {
  const [machines, setMachines] = useState<GamingMachine[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    manufacturer: '',
    type: '',
    denomination: '',
    gameType: '',
    status: '',
  });
  const navigate = useNavigate();

  // Get unique values for filters
  const manufacturers = Array.from(
    new Set(machines.map((m) => m.manufacturer)),
  );

  const statuses = Object.values(MachineStatus);
  const types = Array.from(new Set(machines.map((m) => m.type)));
  const denominations = Array.from(
    new Set(machines.flatMap((m) => m.denominations)),
  );
  const gameTypes = Array.from(new Set(machines.flatMap((m) => m.gameTypes)));

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => id.slice(-6),
    },
    { title: 'Location', dataIndex: 'location', key: 'location' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Manufacturer', dataIndex: 'manufacturer', key: 'manufacturer' },
    { title: 'Model', dataIndex: 'model', key: 'model' },
    {
      title: 'Game Types',
      dataIndex: 'gameTypes',
      key: 'gameTypes',
      render: (gameTypes: string[]) => (
        <>
          {gameTypes.map((type) => (
            <Tag key={type} color="blue" className="mb-1">
              {type}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Player Limits',
      key: 'playerLimits',
      render: (record: GamingMachine) => (
        <Space direction="vertical" size="small">
          <span>Min: ₱{record.playerLimits.minBet}</span>
          <span>Max: ₱{record.playerLimits.maxBet}</span>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: MachineStatus) => (
        <Tag color={getMachineStatusColor(status)}>{status}</Tag>
      ),
      filters: statuses.map((status) => ({ text: status, value: status })),
      onFilter: (value: any, record: GamingMachine) => record.status === value,
    },
  ];

  useEffect(() => {
    fetchMachines();
  }, [
    search,
    filters.manufacturer,
    filters.type,
    filters.denomination,
    filters.gameType,
  ]);

  const fetchMachines = async () => {
    setLoading(true);
    try {
      const data = await gamingMachineService.getGamingMachines(search);
      let filteredData = data;

      // Apply filters
      if (filters.manufacturer) {
        filteredData = filteredData.filter(
          (m: GamingMachine) => m.manufacturer === filters.manufacturer,
        );
      }
      if (filters.type) {
        filteredData = filteredData.filter(
          (m: GamingMachine) => m.type === filters.type,
        );
      }
      if (filters.denomination) {
        filteredData = filteredData.filter((m: GamingMachine) =>
          m.denominations.includes(filters.denomination),
        );
      }
      if (filters.gameType) {
        filteredData = filteredData.filter((m: GamingMachine) =>
          m.gameTypes.includes(filters.gameType),
        );
      }

      setMachines(filteredData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <ComputerDesktopIcon className="h-7 w-7 mr-2 text-primary" />
          Gaming Machines
        </h1>
      </div>

      <Card>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Input
            placeholder="Search machines..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-2"
          />

          <div className="flex flex-wrap gap-4">
            <Select
              placeholder="Filter by Manufacturer"
              allowClear
              style={{ width: 200 }}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, manufacturer: value || '' }))
              }
            >
              {manufacturers.map((m) => (
                <Select.Option key={m} value={m}>
                  {m}
                </Select.Option>
              ))}
            </Select>

            <Select
              placeholder="Filter by Type"
              allowClear
              style={{ width: 200 }}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, type: value || '' }))
              }
            >
              {types.map((t) => (
                <Select.Option key={t} value={t}>
                  {t}
                </Select.Option>
              ))}
            </Select>

            <Select
              placeholder="Filter by Denomination"
              allowClear
              style={{ width: 200 }}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, denomination: value || '' }))
              }
            >
              {denominations.map((d) => (
                <Select.Option key={d} value={d}>
                  ₱{d}
                </Select.Option>
              ))}
            </Select>

            <Select
              placeholder="Filter by Game Type"
              allowClear
              style={{ width: 200 }}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, gameType: value || '' }))
              }
            >
              {gameTypes.map((t) => (
                <Select.Option key={t} value={t}>
                  {t}
                </Select.Option>
              ))}
            </Select>
          </div>
          <Table
            columns={columns}
            dataSource={machines}
            loading={loading}
            rowKey="id"
            onRow={(record) => ({
              onClick: () => navigate(`/gaming-machines/${record.id}`),
              style: { cursor: 'pointer' },
            })}
          />
        </Space>
      </Card>
    </div>
  );
};

export default GamingMachineList;
