import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  MachineOperation,
  MachinesErrorLog,
} from '../models/machine.model';
import { MACHINE_ERROR_LOGS } from './mock-data';

@Injectable({
  providedIn: 'root',
})
export class MachinesErrorLogsService {
  private logs: MachinesErrorLog[] = MACHINE_ERROR_LOGS as MachinesErrorLog[];

  private getNextId(): string {
    if (this.logs.length === 0) {
      return '1';
    }
    const maxId = Math.max(...this.logs.map((l) => Number(l.id)));
    return String(maxId + 1);
  }

  addErrorLog(
    machineId: string,
    operation: MachineOperation,
    message: string,
    userId: string
  ): void {
    const newLog: MachinesErrorLog = {
      id: this.getNextId(),
      machineId,
      operation,
      message,
      date: new Date(),
      createdBy: userId,
    };
    this.logs.unshift(newLog);
  }

  getAll(): Observable<MachinesErrorLog[]> {
    return of(this.logs);
  }

  getForUser(userId: string, isAdmin: boolean): Observable<MachinesErrorLog[]> {
    if (isAdmin) {
      return of(this.logs);
    }
    return of(this.logs.filter((l) => l.createdBy === userId));
  }
}
