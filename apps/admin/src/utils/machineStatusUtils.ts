import { MachineStatus } from '../types/MachineStatus';

export const getMachineStatusColor = (status: MachineStatus): string => {
  switch (status) {
    case MachineStatus.IN_PLAY:
      return 'green';
    case MachineStatus.IDLE:
      return 'blue';
    case MachineStatus.OFFLINE:
      return 'default';
    case MachineStatus.OUT_OF_SERVICE:
      return 'red';
    case MachineStatus.UNDER_MAINTENANCE:
      return 'orange';
    case MachineStatus.FAULT_DETECTED:
      return 'red';
    case MachineStatus.RESERVED:
      return 'purple';
    case MachineStatus.TESTING_MODE:
      return 'cyan';
    case MachineStatus.CASH_COLLECTION:
      return 'gold';
    case MachineStatus.JACKPOT_LOCKDOWN:
      return 'magenta';
    case MachineStatus.SECURITY_LOCKDOWN:
      return 'volcano';
    case MachineStatus.DECOMMISSIONED:
      return 'default';
    default:
      return 'default';
  }
};
