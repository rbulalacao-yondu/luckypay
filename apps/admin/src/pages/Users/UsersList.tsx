import { useState } from 'react';
import {
  Table,
  Input,
  Card,
  Space,
  Tag,
  Button,
  Popconfirm,
  message,
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../../services/userService';
import type { User } from '../../types/User';
import { UserRole, UserStatus } from '../../types/User';
import type { Key } from 'react';

const UsersList: React.FC = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery<User[], Error>({
    queryKey: ['users', search],
    queryFn: () => userService.getUsers(search),
  });

  const deleteUser = useMutation({
    mutationFn: (id: number) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      message.success('User deleted successfully');
    },
    onError: (error: Error) => {
      message.error('Failed to delete user: ' + error.message);
    },
  });

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: number) => String(id).padStart(6, '0'),
      sorter: (a: User, b: User) => a.id - b.id,
    },
    {
      title: 'Name',
      key: 'name',
      render: (record: User) => (
        <span>
          {[record.firstName, record.lastName].filter(Boolean).join(' ') || '-'}
        </span>
      ),
      sorter: (a: User, b: User) => {
        const aName = [a.firstName, a.lastName].filter(Boolean).join(' ');
        const bName = [b.firstName, b.lastName].filter(Boolean).join(' ');
        return aName.localeCompare(bName);
      },
    },
    {
      title: 'Mobile',
      dataIndex: 'mobileNumber',
      key: 'mobileNumber',
      render: (mobile: string, record: User) => (
        <Space>
          {mobile}
          {record.isMobileVerified && <Tag color="green">Verified</Tag>}
        </Space>
      ),
      sorter: (a: User, b: User) =>
        a.mobileNumber.localeCompare(b.mobileNumber),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: UserRole) => (
        <Tag color={role === UserRole.ADMIN ? 'blue' : 'default'}>
          {role.replace(/_/g, ' ').toLowerCase()}
        </Tag>
      ),
      filters: Object.values(UserRole).map((role) => ({
        text: role.replace(/_/g, ' ').toLowerCase(),
        value: role as Key,
      })),
      onFilter: (value: Key | boolean, record: User) => record.role === value,
      sorter: (a: User, b: User) => a.role.localeCompare(b.role),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: UserStatus) => {
        const colors = {
          [UserStatus.ACTIVE]: 'success',
          [UserStatus.INACTIVE]: 'default',
          [UserStatus.SUSPENDED]: 'error',
          [UserStatus.PENDING_VERIFICATION]: 'warning',
        };
        return (
          <Tag color={colors[status]}>
            {status.replace(/_/g, ' ').toLowerCase()}
          </Tag>
        );
      },
      filters: Object.values(UserStatus).map((status) => ({
        text: status.replace(/_/g, ' ').toLowerCase(),
        value: status as Key,
      })),
      onFilter: (value: Key | boolean, record: User) => record.status === value,
      sorter: (a: User, b: User) => a.status.localeCompare(b.status),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: User) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => navigate(`/users/${record.id}/edit`)}
          />
          <Popconfirm
            title="Delete user"
            description="Are you sure you want to delete this user?"
            onConfirm={() => deleteUser.mutate(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/users/create')}
          className="bg-primary hover:bg-primary-dark"
        >
          Add User
        </Button>
      </div>

      <Card>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input
            placeholder="Search users..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />

          <Table
            columns={columns}
            dataSource={users}
            rowKey="id"
            loading={isLoading}
          />
        </Space>
      </Card>
    </div>
  );
};

export default UsersList;
