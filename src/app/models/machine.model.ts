export type MachineState = 'UPALJENA' | 'UGASENA';
export type MachineOperation = 'UPALI' | 'UGASI' | 'RESTARTUJ';

export interface Machine {
  id: number;
  name: string;
  type: string;
  description?: string;
  state: MachineState;
  createdBy: number;
  active: boolean;
  createdAt: Date;
}

export interface MachineErrorLog {
  id: number;
  machineId: number;
  operation: MachineOperation;
  message: string;
  date: Date;
  createdBy: number;
}
