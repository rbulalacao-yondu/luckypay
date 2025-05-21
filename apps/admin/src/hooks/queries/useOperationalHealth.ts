import { useState } from 'react';

interface OperationalHealthData {
  systemStatus: {
    activeMachines: number;
    maintenanceNeeded: number;
    softwareVersions: Array<{
      version: string;
      count: number;
    }>;
    errorRates: Array<{
      date: string;
      errors: number;
    }>;
  };
  realTimeData: {
    activeSessions: number;
    recentTransactions: Array<{
      id: string;
      time: string;
      type: string;
      amount: number;
      machineId: string;
    }>;
    occupancyRates: Array<{
      location: string;
      occupancy: number;
      totalMachines: number;
    }>;
  };
}

export const useOperationalHealth = () => {
  // TODO: Replace with actual API call
  const [data] = useState<OperationalHealthData>({
    systemStatus: {
      activeMachines: 245,
      maintenanceNeeded: 12,
      softwareVersions: [
        { version: 'v2.1.0', count: 150 },
        { version: 'v2.0.0', count: 80 },
        { version: 'v1.9.0', count: 15 },
      ],
      errorRates: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        errors: Math.floor(Math.random() * 50),
      })).reverse(),
    },
    realTimeData: {
      activeSessions: 178,
      recentTransactions: Array.from({ length: 10 }, (_, i) => ({
        id: `T${Math.random().toString(36).substr(2, 9)}`,
        time: new Date(Date.now() - i * 60 * 1000).toISOString(),
        type: Math.random() > 0.5 ? 'Coin-In' : 'Cash-In',
        amount: Math.floor(Math.random() * 10000),
        machineId: `M${Math.floor(Math.random() * 1000)}`,
      })),
      occupancyRates: [
        { location: 'Floor 1', occupancy: 85, totalMachines: 100 },
        { location: 'Floor 2', occupancy: 65, totalMachines: 80 },
        { location: 'VIP Area', occupancy: 92, totalMachines: 40 },
        { location: 'Slots Zone', occupancy: 78, totalMachines: 25 },
      ],
    },
  });

  return { data, isLoading: false };
};
