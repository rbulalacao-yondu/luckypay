import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Spin, Tag, Space, Button } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { gamingMachineService } from '../../services/gamingMachineService.ts';
import type { GamingMachine } from '../../types/GamingMachine';

const GamingMachineDetails: React.FC = () => {
  const [machine, setMachine] = useState<GamingMachine | null>(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchMachine(id);
    }
  }, [id]);

  const fetchMachine = async (machineId: string) => {
    setLoading(true);
    try {
      const data = await gamingMachineService.getGamingMachine(machineId);
      setMachine(data);
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

  if (!machine) return null;

  return (
    <div className="p-6">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              icon={<ArrowLeftIcon className="h-5 w-5" />}
              onClick={() => navigate('/gaming-machines')}
              className="mr-4"
            >
              Back to List
            </Button>
            <h1 className="text-2xl font-bold">Gaming Machine Details</h1>
          </div>
        </div>

        <Card title={`Gaming Machine ${machine.id}`}>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Location">
              {machine.location}
            </Descriptions.Item>
            <Descriptions.Item label="Type">{machine.type}</Descriptions.Item>
            <Descriptions.Item label="Manufacturer">
              {machine.manufacturer}
            </Descriptions.Item>
            <Descriptions.Item label="Model">{machine.model}</Descriptions.Item>
            <Descriptions.Item label="Denominations">
              {machine.denominations.map((d) => (
                <Tag key={d} color="blue" className="mb-1">
                  ${d}
                </Tag>
              ))}
            </Descriptions.Item>
            <Descriptions.Item label="Game Types">
              {machine.gameTypes.map((t) => (
                <Tag key={t} color="purple" className="mb-1">
                  {t}
                </Tag>
              ))}
            </Descriptions.Item>
            <Descriptions.Item label="Pay Tables">
              {machine.payTables.map((p) => (
                <Tag key={p} color="green" className="mb-1">
                  {p}
                </Tag>
              ))}
            </Descriptions.Item>
            <Descriptions.Item label="Player Limits">
              <Space direction="vertical">
                <span>Minimum Bet: ₱{machine.playerLimits.minBet}</span>
                <span>Maximum Bet: ₱{machine.playerLimits.maxBet}</span>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Firmware Version">
              {machine.firmwareVersion}
            </Descriptions.Item>
            <Descriptions.Item label="Game Version">
              {machine.gameVersion}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Space>
    </div>
  );
};

export default GamingMachineDetails;
