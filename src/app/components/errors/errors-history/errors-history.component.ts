import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionService } from '../../../services/permission.service';
import { ErrorLogService } from '../../../services/error-log.service'; // pretpostavljam da ga imaš

@Component({
  selector: 'app-errors-history',
  templateUrl: './errors-history.component.html',
  styleUrls: ['./errors-history.component.css']
})
export class ErrorsHistoryComponent implements OnInit {

  logs: any[] = [];

  constructor(
    private permission: PermissionService,
    private router: Router,
    private errorService: ErrorLogService
  ) {}

  ngOnInit(): void {
    if (!this.permission.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.permission.canViewErrors()) {
      this.router.navigate(['/no-permissions']);
      return;
    }

    const userId = this.permission.getCurrentUserId();
    const isAdmin = this.permission.isAdmin();

    const all = this.errorService.getAll();

    this.logs = isAdmin
      ? all
      : all.filter(l => l.createdBy === userId);
  }
}
