import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Space, Descriptions, Tag, Button, Spin, message } from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { userService } from '../../services/userService';
import type { User } from '../../types/User';
import { UserRole, UserStatus } from '../../types/User';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const UserDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery<User>({
    queryKey: ['user', id],
    queryFn: async () => {
      try {
        const user = await userService.getUser(Number(id));
        if (!user) {
          throw new Error('User not found');
        }
        return user;
      } catch (err) {
        throw new Error(
          err instanceof Error ? err.message : 'Failed to fetch user',
        );
      }
    },
    enabled: !!id,
    staleTime: 30000, // Cache for 30 seconds
    gcTime: 300000, // Keep unused data for 5 minutes
  });

  useEffect(() => {
    if (error) {
      message.error(
        'Failed to fetch user details: ' + (error as Error).message,
      );
      navigate('/users');
    }
  }, [error, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!user) return null;

  const statusColors = {
    [UserStatus.ACTIVE]: 'success',
    [UserStatus.INACTIVE]: 'default',
    [UserStatus.SUSPENDED]: 'error',
    [UserStatus.PENDING_VERIFICATION]: 'warning',
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/users')}
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold m-0">User Details</h1>
        </Space>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => navigate(`/users/${id}/edit`)}
        >
          Edit User
        </Button>
      </div>

      <Card>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="ID">
            {String(user.id).padStart(6, '0')}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={statusColors[user.status]}>
              {user.status.replace(/_/g, ' ').toLowerCase()}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Name">
            {[user.firstName, user.lastName].filter(Boolean).join(' ') || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Role">
            <Tag color={user.role === UserRole.ADMIN ? 'blue' : 'default'}>
              {user.role.replace(/_/g, ' ').toLowerCase()}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Mobile">
            <Space>
              {user.mobileNumber}
              {user.isMobileVerified && <Tag color="green">Verified</Tag>}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            <Space>
              {user.email || '-'}
              {user.isEmailVerified && <Tag color="green">Verified</Tag>}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Wallet Balance">
            {currencyFormatter.format(user.walletBalance)}
          </Descriptions.Item>
          <Descriptions.Item label="Loyalty Tier">
            <Tag color="purple">{user.loyaltyTier}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Loyalty Points">
            <Tag color="gold">{user.loyaltyPoints.toLocaleString()}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Last Login">
            {user.lastLoginAt
              ? new Date(user.lastLoginAt).toLocaleString()
              : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {new Date(user.createdAt).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {new Date(user.updatedAt).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Address" span={2}>
            {user.address || '-'}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default UserDetails;
