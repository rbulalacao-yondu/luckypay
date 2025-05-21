import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, Descriptions, Button, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { coinInService } from '../../services/coinInService';
import dayjs from 'dayjs';

export default function CoinInDetails() {
  const { id } = useParams<{ id: string }>();

  const { data: coinIn, isLoading } = useQuery(['coinIn', id], () =>
    coinInService.getById(id!),
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spin size="large" />
      </div>
    );
  }

  if (!coinIn) {
    return <div>Coin-in not found</div>;
  }

  return (
    <Card
      title={
        <div className="flex items-center gap-4">
          <Link to="/coin-ins">
            <Button icon={<ArrowLeftOutlined />}>Back</Button>
          </Link>
          <span>Coin-In Details</span>
        </div>
      }
    >
      <Descriptions bordered column={2}>
        <Descriptions.Item label="ID">{coinIn.id}</Descriptions.Item>
        <Descriptions.Item label="User">
          {coinIn.user?.username || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label="Machine">
          {coinIn.machine?.name || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label="Game Type">
          {coinIn.gameType}
        </Descriptions.Item>
        <Descriptions.Item label="Amount">
          ₱{coinIn.amount.toFixed(2)}
        </Descriptions.Item>
        <Descriptions.Item label="Machine Balance">
          ₱{coinIn.machineBalance.toFixed(2)}
        </Descriptions.Item>
        <Descriptions.Item label="Timestamp">
          {dayjs(coinIn.timestamp).format('YYYY-MM-DD HH:mm:ss')}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
}
