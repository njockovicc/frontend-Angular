import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MachinesErrorLog } from '../models/machine.model';
import { MACHINE_ERROR_LOGS } from './mock-data';

@Injectable({
  providedIn: 'root',
})
export class MachinesErrorLogsService {
  private logs: MachinesErrorLog[] = MACHINE_ERROR_LOGS as MachinesErrorLog[];

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
