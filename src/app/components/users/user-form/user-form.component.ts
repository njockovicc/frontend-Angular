import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { PermissionService } from '../../../services/permission.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  user: User = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    permissions: [],
    password: ''
  };

  isEdit = false;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private permission: PermissionService
  ) {}

  allPermissions: string[] = [
    'create_user',
    'read_user',
    'update_user',
    'delete_user',
    'search_machine',
    'start_machine',
    'stop_machine',
    'restart_machine',
    'create_machine',
    'destroy_machine'
  ];

  ngOnInit(): void {
    if (!this.permission.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      // edit
      if (!this.permission.canUpdateUsers()) {
        this.router.navigate(['/no-permissions']);
        return;
      }
      this.isEdit = true;
      const id = Number(idParam);
      const existing = this.userService.getById(id);
      if (existing) {
        this.user = { ...existing, permissions: [...existing.permissions] };
      }
    } else {
      // create
      if (!this.permission.canCreateUsers()) {
        this.router.navigate(['/no-permissions']);
        return;
      }
    }
  }

  onSubmit(): void {
    if (!this.user.firstName || !this.user.lastName || !this.user.email) {
      alert('Sva polja su obavezna!');
      return;
    }

    if (this.isEdit) {
      const res = this.userService.update(this.user);
      if (!res.success) {
        alert(res.message);
        return;
      }
    } else {
      const res = this.userService.create(this.user);
      if (!res.success) {
        alert(res.message);
        return;
      }
    }

    this.router.navigate(['/users']);
  }

  togglePermission(p: string): void {
    if (this.user.permissions.includes(p)) {
      this.user.permissions = this.user.permissions.filter(x => x !== p);
    } else {
      this.user.permissions.push(p);
    }
  }

  cancel(): void {
    this.router.navigate(['/users']);
  }
}
