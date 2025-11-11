import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { PermissionService } from '../../../services/permission.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  users: User[] = [];
  noPermission = false;

  canCreate = false;
  canUpdate = false;
  canDelete = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private permission: PermissionService
  ) {}

  ngOnInit(): void {
    if (!this.permission.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // dozvole
    this.canCreate = this.permission.canCreateUsers();
    this.canUpdate = this.permission.canUpdateUsers();
    this.canDelete = this.permission.canDeleteUsers();

    if (!this.permission.canReadUsers()) {
      this.noPermission = true;
      return;
    }

    this.users = this.userService.getAll();
  }

  deleteUser(id: number) {
    if (!this.canDelete) {
      alert('Nemaš dozvolu za brisanje korisnika!');
      return;
    }
    this.userService.delete(id);
    this.users = this.userService.getAll();
  }

  goToEdit(user: User) {
    if (!this.canUpdate) {
      alert('Nemaš dozvolu za izmenu!');
      return;
    }
    this.router.navigate(['/users', user.id]);
  }

  newUser() {
    if (!this.canCreate) {
      alert('Nemaš dozvolu za pravljenje korisnika!');
      return;
    }
    this.router.navigate(['/users/new']);
  }
}
