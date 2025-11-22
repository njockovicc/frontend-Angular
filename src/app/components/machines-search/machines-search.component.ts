import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  Observable,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { Machine, MachineState } from '../../models/machine.model';
import { AuthService } from '../../services/auth.service';
import { MachinesService } from '../../services/machines.service';

@Component({
  selector: 'app-machines-search',
  templateUrl: './machines-search.component.html',
})
export class MachinesSearchComponent implements OnInit {
  machines$!: Observable<Machine[]>;
  canSearchMachines$!: Observable<boolean>;
  canCreateMachine$!: Observable<boolean>;
  canDestroyMachine$!: Observable<boolean>;
  canStartMachine$!: Observable<boolean>;
  canStopMachine$!: Observable<boolean>;
  canRestartMachine$!: Observable<boolean>;
  canSchedule$!: Observable<boolean>;
  searchForm: FormGroup;

  allStates: MachineState[] = ['UPALJENA', 'UGASENA'];

  private refreshTrigger = new BehaviorSubject<void>(undefined);

  constructor(
    private machineService: MachinesService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      name: [''],
      states: [[] as MachineState[]],
      startDate: [''],
      endDate: [''],
    });
  }

  ngOnInit(): void {
    this.canSearchMachines$ = this.authService.hasPermission('search_machine');
    this.canCreateMachine$ = this.authService.hasPermission('create_machine');
    this.canDestroyMachine$ = this.authService.hasPermission('destroy_machine'); 
    this.canStartMachine$ = this.authService.hasPermission('start_machine');
    this.canStopMachine$ = this.authService.hasPermission('stop_machine');
    this.canRestartMachine$ = this.authService.hasPermission('restart_machine');
    this.canSchedule$ = this.authService.hasPermission('read_schedules');

    const formChanges$ = this.searchForm.valueChanges.pipe(
      startWith(this.searchForm.value)
    );

    this.machines$ = combineLatest([
      this.authService.authUser$,
      formChanges$,
      this.refreshTrigger,
    ]).pipe(
      debounceTime(300),
      switchMap(([user, formValue, _]) => {
        if (!user) {
          return of([]);
        }
        return this.machineService.search(formValue, user);
      })
    );
  }

  toggleState(state: MachineState): void {
    const currentStates = this.searchForm.get('states')
      ?.value as MachineState[];
    const newStates = currentStates.includes(state)
      ? currentStates.filter((s) => s !== state)
      : [...currentStates, state];
    this.searchForm.get('states')?.setValue(newStates);
  }

  delete(id: string): void {
    this.machineService.destroy(id).subscribe(() => {
      this.refreshTrigger.next();
    });
  }

  start(id: string): void {
    this.machineService.startMachine(id).subscribe(() => {
      this.refreshTrigger.next();
    });
  }

  stop(id: string): void {
    this.machineService.stopMachine(id).subscribe(() => {
      this.refreshTrigger.next();
    });
  }

  restart(id: string): void {
    this.machineService.restartMachine(id).subscribe(() => {
      this.refreshTrigger.next();
    });
  }

  isStateSelected(state: MachineState): boolean {
    return (this.searchForm.get('states')?.value ?? []).includes(state);
  }
}
