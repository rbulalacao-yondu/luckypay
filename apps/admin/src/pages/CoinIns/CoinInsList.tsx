import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, Input, DatePicker, Select, Card } from 'antd';
import { coinInService } from '../../services/coinInService';
import { gamingMachineService } from '../../services/gamingMachineService';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import type { CoinIn } from '../../types/CoinIn';
import type { GamingMachine } from '../../types/GamingMachine';
import type { User } from '../../types/User';

const { RangePicker } = DatePicker;

interface PaginatedResponse<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const CoinInsList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null]
  >([null, null]);
  const [selectedMachine, setSelectedMachine] = useState<string>();
  const [selectedGameType, setSelectedGameType] = useState<string>();

  const { data: machinesData } = useQuery<GamingMachine[]>({
    queryKey: ['gamingMachines'],
    queryFn: () => gamingMachineService.getGamingMachines(),
  });

  const { data, isLoading } = useQuery<PaginatedResponse<CoinIn>>({
    queryKey: [
      'coinIns',
      page,
      pageSize,
      search,
      dateRange,
      selectedMachine,
      selectedGameType,
    ],
    queryFn: () =>
      coinInService.getAll({
        page,
        limit: pageSize,
        search,
        fromDate: dateRange[0]?.toISOString(),
        toDate: dateRange[1]?.toISOString(),
        machineId: selectedMachine,
        gameType: selectedGameType,
      }),
  });

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => (
        <Link to={`/coin-ins/${id}`}>{id.slice(-6)}</Link>
      ),
    },
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      render: (user: User) => {
        if (!user) return 'N/A';
        const fullName = [user.firstName, user.lastName]
          .filter(Boolean)
          .join(' ');
        return fullName || user.mobileNumber || 'N/A';
      },
    },
    {
      title: 'Machine',
      dataIndex: 'machine',
      key: 'machine',
      render: (machine: GamingMachine) => machine?.model || 'N/A',
    },
    {
      title: 'Game Type',
      dataIndex: 'gameType',
      key: 'gameType',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => {
        const value = Number(amount);
        return isNaN(value) ? '₱0.00' : `₱${value.toFixed(2)}`;
      },
    },
    {
      title: 'Machine Balance',
      dataIndex: 'machineBalance',
      key: 'machineBalance',
      render: (balance: number) => {
        const value = Number(balance);
        return isNaN(value) ? '₱0.00' : `₱${value.toFixed(2)}`;
      },
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  return (
    <Card title="Coin-Ins">
      <div className="mb-4 flex flex-wrap gap-4">
        <Input.Search
          placeholder="Search by user or machine name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
        <RangePicker
          onChange={(dates) =>
            setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null])
          }
        />
        <Select
          placeholder="Select Machine"
          value={selectedMachine}
          onChange={setSelectedMachine}
          className="w-48"
          allowClear
        >
          {machinesData?.map((machine: GamingMachine) => (
            <Select.Option key={machine.id} value={machine.id}>
              {machine.model}
            </Select.Option>
          ))}
        </Select>
        <Select
          placeholder="Select Game Type"
          value={selectedGameType}
          onChange={setSelectedGameType}
          className="w-48"
          allowClear
        >
          <Select.Option value="slots">Slots</Select.Option>
          <Select.Option value="poker">Poker</Select.Option>
          <Select.Option value="blackjack">Blackjack</Select.Option>
        </Select>
      </div>

      <Table
        dataSource={data?.items}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: page,
          pageSize,
          total: data?.meta.total,
          onChange: (newPage, newPageSize) => {
            setPage(newPage);
            setPageSize(newPageSize);
          },
        }}
      />
    </Card>
  );
};

export default CoinInsList;
