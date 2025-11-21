import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { MachinesErrorLog } from 'src/app/models/machine.model';
import { AuthService } from 'src/app/services/auth.service';
import { MachinesErrorLogsService } from 'src/app/services/machines-error-logs.service';

@Component({
  selector: 'app-machines-error-logs-list',
  templateUrl: './machines-error-logs-list.component.html',
  styleUrls: ['./machines-error-logs-list.component.css'],
})
export class MachinesErrorLogsListComponent implements OnInit {
  machinesErrorLogs$!: Observable<MachinesErrorLog[]>;

  constructor(
    private router: Router,
    private errorService: MachinesErrorLogsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.machinesErrorLogs$ = this.authService.authUser$.pipe(
      switchMap((user) => {
        if (!user) {
          return of([]);
        }
        const isAdmin = user.permissions.includes('is_admin');
        return this.errorService.getForUser(user.id, isAdmin);
      })
    );
  }
}
