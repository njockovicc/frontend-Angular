export type MachineState = 'UPALJENA' | 'UGASENA';
export type MachineOperation = 'UPALI' | 'UGASI' | 'RESTARTUJ';

export interface Machine {
  id: string;
  name: string;
  type: string;
  description?: string;
  state: MachineState;
  createdBy: string;
  active: boolean;
  createdAt: Date;
}

export interface MachinesErrorLog {
  id: string;
  machineId: string;
  operation: MachineOperation;
  message: string;
  date: Date;
  createdBy: string;
}
