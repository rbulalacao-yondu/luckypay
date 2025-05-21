import { useState } from 'react';

interface LoyaltyProgramData {
  programMetrics: {
    points: {
      awarded: number;
      redeemed: number;
      dateRange: Array<{
        date: string;
        awarded: number;
        redeemed: number;
      }>;
    };
    tierProgression: Array<{
      tier: string;
      promotedCount: number;
      demotedCount: number;
      currentCount: number;
    }>;
    membershipGrowth: Array<{
      date: string;
      newMembers: number;
      totalMembers: number;
    }>;
    retentionRates: Array<{
      tier: string;
      rate: number;
      activePlayers: number;
      totalPlayers: number;
    }>;
  };
  memberAnalysis: {
    tierDistribution: Array<{
      tier: string;
      count: number;
      averagePoints: number;
    }>;
    pointsEconomy: {
      totalPointsCirculating: number;
      monthlyPointsAwarded: number;
      monthlyPointsRedeemed: number;
      averagePointsPerMember: number;
    };
    engagement: Array<{
      tier: string;
      averageScore: number;
      metrics: {
        visitFrequency: number;
        avgSessionDuration: number;
        redemptionRate: number;
      };
    }>;
  };
}

export const useLoyaltyProgram = () => {
  // TODO: Replace with actual API call
  const [data] = useState<LoyaltyProgramData>({
    programMetrics: {
      points: {
        awarded: 2567890,
        redeemed: 1890456,
        dateRange: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
          awarded: Math.floor(Math.random() * 50000 + 30000),
          redeemed: Math.floor(Math.random() * 40000 + 20000),
        })).reverse(),
      },
      tierProgression: [
        {
          tier: 'Diamond',
          promotedCount: 15,
          demotedCount: 3,
          currentCount: 125,
        },
        {
          tier: 'Platinum',
          promotedCount: 45,
          demotedCount: 12,
          currentCount: 380,
        },
        {
          tier: 'Gold',
          promotedCount: 120,
          demotedCount: 35,
          currentCount: 850,
        },
        {
          tier: 'Silver',
          promotedCount: 280,
          demotedCount: 65,
          currentCount: 1650,
        },
        {
          tier: 'Bronze',
          promotedCount: 450,
          demotedCount: 180,
          currentCount: 2800,
        },
      ],
      membershipGrowth: Array.from({ length: 7 }, (_, i) => {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        const baseMembers = 5000;
        const dailyGrowth = Math.floor(Math.random() * 50 + 30);
        return {
          date: date.toISOString().split('T')[0],
          newMembers: dailyGrowth,
          totalMembers: baseMembers + dailyGrowth * (7 - i),
        };
      }).reverse(),
      retentionRates: [
        { tier: 'Diamond', rate: 0.95, activePlayers: 119, totalPlayers: 125 },
        { tier: 'Platinum', rate: 0.92, activePlayers: 350, totalPlayers: 380 },
        { tier: 'Gold', rate: 0.88, activePlayers: 748, totalPlayers: 850 },
        { tier: 'Silver', rate: 0.82, activePlayers: 1353, totalPlayers: 1650 },
        { tier: 'Bronze', rate: 0.75, activePlayers: 2100, totalPlayers: 2800 },
      ],
    },
    memberAnalysis: {
      tierDistribution: [
        { tier: 'Diamond', count: 125, averagePoints: 250000 },
        { tier: 'Platinum', count: 380, averagePoints: 120000 },
        { tier: 'Gold', count: 850, averagePoints: 50000 },
        { tier: 'Silver', count: 1650, averagePoints: 15000 },
        { tier: 'Bronze', count: 2800, averagePoints: 3000 },
      ],
      pointsEconomy: {
        totalPointsCirculating: 128945670,
        monthlyPointsAwarded: 2567890,
        monthlyPointsRedeemed: 1890456,
        averagePointsPerMember: 22456,
      },
      engagement: [
        {
          tier: 'Diamond',
          averageScore: 9.2,
          metrics: {
            visitFrequency: 12.5,
            avgSessionDuration: 3.2,
            redemptionRate: 0.85,
          },
        },
        {
          tier: 'Platinum',
          averageScore: 8.5,
          metrics: {
            visitFrequency: 8.3,
            avgSessionDuration: 2.8,
            redemptionRate: 0.75,
          },
        },
        {
          tier: 'Gold',
          averageScore: 7.8,
          metrics: {
            visitFrequency: 5.2,
            avgSessionDuration: 2.3,
            redemptionRate: 0.65,
          },
        },
        {
          tier: 'Silver',
          averageScore: 6.5,
          metrics: {
            visitFrequency: 3.1,
            avgSessionDuration: 1.8,
            redemptionRate: 0.45,
          },
        },
        {
          tier: 'Bronze',
          averageScore: 5.2,
          metrics: {
            visitFrequency: 1.8,
            avgSessionDuration: 1.2,
            redemptionRate: 0.25,
          },
        },
      ],
    },
  });

  return { data, isLoading: false };
};
