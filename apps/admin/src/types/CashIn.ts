export enum CashInChannel {
  GCASH = 'gcash',
}

export interface CashIn {
  id: string;
  userId: number;
  user: {
    id: number;
    firstName?: string;
    lastName?: string;
    mobileNumber: string;
  };
  amount: number;
  endingBalance: number;
  channel: CashInChannel;
  referenceId?: string;
  timestamp: Date;
}
