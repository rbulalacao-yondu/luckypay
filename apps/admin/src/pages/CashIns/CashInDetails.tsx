import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Spin, Tag, Space, Button } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { cashInService } from '../../services/cashInService';
import type { CashIn } from '../../types/CashIn';
import { CashInChannel } from '../../types/CashIn';

const channelLabels = {
  [CashInChannel.GCASH]: 'GCash',
};

const CashInDetails: React.FC = () => {
  const [cashIn, setCashIn] = useState<CashIn | null>(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchCashIn(id);
    }
  }, [id]);

  const fetchCashIn = async (cashInId: string) => {
    setLoading(true);
    try {
      const data = await cashInService.getCashIn(cashInId);
      setCashIn(data);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );

  if (!cashIn) return null;

  return (
    <div className="p-6">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              icon={<ArrowLeftIcon className="h-5 w-5" />}
              onClick={() => navigate('/cash-ins')}
              className="mr-4"
            >
              Back to List
            </Button>
            <h1 className="text-2xl font-bold">Cash-in Details</h1>
          </div>
        </div>

        <Card title={`Cash-in ${cashIn.id}`}>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="User">
              {[cashIn.user.firstName, cashIn.user.lastName]
                .filter(Boolean)
                .join(' ') || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Mobile Number">
              {cashIn.user.mobileNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Channel">
              <Tag color="blue">{channelLabels[cashIn.channel]}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Amount">
              ₱{cashIn.amount.toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Ending Balance">
              ₱{cashIn.endingBalance.toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Reference ID">
              {cashIn.referenceId || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Timestamp">
              {new Date(cashIn.timestamp).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Space>
    </div>
  );
};

export default CashInDetails;
