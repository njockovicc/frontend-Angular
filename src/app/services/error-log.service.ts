import { Injectable } from '@angular/core';
import { ErrorLog } from '../models/error-log.model';

@Injectable({
  providedIn: 'root'
})
export class ErrorLogService {

  private logs: ErrorLog[] = [
    {
      id: 1,
      machineId: 1,
      operation: 'UPALI',
      message: 'Mašina nije bila u stanju UGASENA.',
      date: new Date('2025-11-08T10:30:00'),
      createdBy: 1
    },
    {
      id: 2,
      machineId: 3,
      operation: 'RESTARTUJ',
      message: 'Mašina nije bila UPALJENA.',
      date: new Date('2025-11-08T11:15:00'),
      createdBy: 3
    },
    {
      id: 3,
      machineId: 2,
      operation: 'UGASI',
      message: 'Mašina nije bila UPALJENA.',
      date: new Date('2025-09-08T11:15:00'),
      createdBy: 1
    }
  ];

  getAll(): ErrorLog[] {
    return this.logs;
  }

  getForUser(userId: number, isAdmin: boolean): ErrorLog[] {
    if (isAdmin) {
      return this.logs;
    }
    return this.logs.filter(l => l.createdBy === userId);
  }
}
