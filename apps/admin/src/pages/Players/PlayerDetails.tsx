import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Descriptions, Tag, Skeleton, Space } from 'antd';
import { UserIcon } from '@heroicons/react/24/outline';
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

const PlayerDetails: React.FC = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPlayer(parseInt(id, 10));
    }
  }, [id]);

  const fetchPlayer = async (playerId: number) => {
    try {
      const data = await playerService.getPlayer(playerId);
      setPlayer(data);
    } catch (error) {
      console.error('Failed to fetch player details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton active />
      </div>
    );
  }

  if (!player) {
    return (
      <div className="p-6">
        <h1>Player not found</h1>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <UserIcon className="h-7 w-7 mr-2 text-primary" />
          Player Details
        </h1>
      </div>

      <Card>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="ID">
            {String(player.id).padStart(6, '0')}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={statusColors[player.status]}>
              {player.status.replace(/_/g, ' ').toLowerCase()}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Name">
            {[player.firstName, player.lastName].filter(Boolean).join(' ') ||
              '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Mobile">
            <Space>
              {player.mobileNumber}
              {player.isMobileVerified && <Tag color="green">Verified</Tag>}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            <Space>
              {player.email || '-'}
              {player.email && player.isEmailVerified && (
                <Tag color="green">Verified</Tag>
              )}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Date of Birth">
            {player.dateOfBirth
              ? new Date(player.dateOfBirth).toLocaleDateString()
              : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Address">
            {player.address || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Loyalty">
            <Space direction="vertical">
              <Tag
                color={loyaltyTierColors[player.loyaltyTier]}
                style={{ color: 'black' }}
              >
                {player.loyaltyTier}
              </Tag>
              <span>{player.loyaltyPoints.toLocaleString()} points</span>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Wallet Balance">
            ₱{player.walletBalance.toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Last Login">
            {player.lastLoginAt
              ? new Date(player.lastLoginAt).toLocaleString()
              : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Member Since">
            {new Date(player.createdAt).toLocaleDateString()}
          </Descriptions.Item>
          <Descriptions.Item label="Last Updated">
            {new Date(player.updatedAt).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default PlayerDetails;
