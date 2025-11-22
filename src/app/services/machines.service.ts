import { Injectable } from '@angular/core';
import { Observable, of, map, switchMap, delay, tap, take } from 'rxjs';
import {
  Machine,
  MachineSchedule,
  MachineState,
} from '../models/machine.model';
import { User } from '../models/user.model';
import { MOCK_MACHINES } from './mock-data';
import { MachinesErrorLogsService } from './machines-error-logs.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class MachinesService {
  private machines: Machine[] = MOCK_MACHINES as Machine[];

  constructor(
    private errorLogsService: MachinesErrorLogsService,
    private authService: AuthService
  ) {}

  private getAllActive(): Observable<Machine[]> {
    return of(this.machines.filter((m) => m.active));
  }

  getAllFor(userId: string, isAdmin: boolean): Observable<Machine[]> {
    return this.getAllActive().pipe(
      map((all) => {
        if (isAdmin) {
          return all;
        }
        return all.filter((m) => m.createdBy === userId);
      })
    );
  }

  search(
    filter: {
      name?: string;
      states?: MachineState[];
      startDate?: string;
      endDate?: string;
    },
    user: User
  ): Observable<Machine[]> {
    const isAdmin =
      user.permissions.includes('create_user') &&
      user.permissions.includes('delete_user');

    return this.getAllFor(user.id, isAdmin).pipe(
      map((source) => {
        let result = [...source];

        if (filter.name && filter.name.trim() !== '') {
          const lower = filter.name.toLowerCase();
          result = result.filter((m) => m.name.toLowerCase().includes(lower));
        }

        if (filter.states && filter.states.length > 0) {
          result = result.filter((m) => filter.states!.includes(m.state));
        }

        if (filter.startDate) {
          const start = new Date(filter.startDate);
          result = result.filter((m) => m.createdAt >= start);
        }

        if (filter.endDate) {
          const end = new Date(filter.endDate);
          end.setHours(23, 59, 59, 999);
          result = result.filter((m) => m.createdAt <= end);
        }

        return result;
      })
    );
  }

  private getNextId(): Observable<string> {
    if (this.machines.length === 0) {
      return of('1');
    }
    const maxId = Math.max(...this.machines.map((m) => Number(m.id)));
    return of(String(maxId + 1));
  }

  create(machine: {
    name: string;
    type: string;
    description?: string;
    createdBy: string;
  }): Observable<Machine> {
    return this.getNextId().pipe(
      map((newId) => {
        const newMachine: Machine = {
          id: newId,
          name: machine.name,
          type: machine.type,
          description: machine.description,
          state: 'UGASENA',
          createdBy: machine.createdBy,
          active: true,
          createdAt: new Date(),
        };
        this.machines.push(newMachine);
        return newMachine;
      })
    );
  }

  destroy(id: string): Observable<void> {
    const m = this.machines.find((x) => x.id === id);
    if (m) {
      m.active = false;
    }
    return of(undefined);
  }

  startMachine(id: string): Observable<void> {
    const machine = this.machines.find((m) => m.id === id);
    if (machine) {
      machine.state = 'UGASENA...';
    }

    return of(undefined).pipe(
      delay(4000),
      map(() => {
        if (machine) {
          machine.state = 'UPALJENA';
        }
      })
    );
  }

  stopMachine(id: string): Observable<void> {
    const machine = this.machines.find((m) => m.id === id);
    if (machine) {
      machine.state = 'UPALJENA...';
    }

    return of(undefined).pipe(
      delay(4000), 
      map(() => {
        if (machine) {
          machine.state = 'UGASENA';
        }
      })
    );
  }

  restartMachine(id: string): Observable<void> {
    const machine = this.machines.find((m) => m.id === id);
    if (machine) {
      machine.state = 'UPALJENA...';
    }

    return of(undefined).pipe(
      delay(2000),
      tap(() => {
        if (machine) {
          machine.state = 'UGASENA...';
        }
      }),
      delay(2000),
      map(() => {
        if (machine) {
          machine.state = 'UPALJENA';
        }
      })
    );
  }

  scheduleMachine(
    machineId: string,
    schedule: MachineSchedule
  ): Observable<void> {
    const machine = this.machines.find((m) => m.id === machineId);
    if (!machine) {
      return of(undefined);
    }

    if (schedule.operation === 'UPALI' && machine.state === 'UPALJENA') {
      this.authService.authUser$.pipe(take(1)).subscribe((user) => {
        if (user) {
          this.errorLogsService.addErrorLog(
            machineId,
            'UPALI',
            'Masina nije bila UGASENA',
            user.id
          );
        }
      });
    } else if (schedule.operation === 'UGASI' && machine.state === 'UGASENA') {
      this.authService.authUser$.pipe(take(1)).subscribe((user) => {
        if (user) {
          this.errorLogsService.addErrorLog(
            machineId,
            'UGASI',
            'Masina nije bila UPALJENA',
            user.id
          );
        }
      });
    } else if (
      schedule.operation === 'RESTARTUJ' &&
      machine.state !== 'UPALJENA'
    ) {
      this.authService.authUser$.pipe(take(1)).subscribe((user) => {
        if (user) {
          this.errorLogsService.addErrorLog(
            machineId,
            'RESTARTUJ',
            'Masina nije bila UPALJENA da bi se restartovala',
            user.id
          );
        }
      });
    } else {
      machine.schedule = schedule;
    }

    return of(undefined);
  }
}
