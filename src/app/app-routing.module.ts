import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { AuthGuard } from './guards/auth.guard';
import { PermissionGuard } from './guards/permission.guard';
import { NoPermissionsComponent } from './components/no-permissions/no-permissions.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'no-permissions', component: NoPermissionsComponent },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'users',
        component: UsersListComponent,
        canActivate: [PermissionGuard],
        data: { permissions: ['read_user'] },
      },
      // { path: 'users/new', component: UserFormComponent, canActivate: [PermissionGuard], data: { permissions: ['create_user'] } },
      // { path: 'users/:id', component: UserFormComponent, canActivate: [PermissionGuard], data: { permissions: ['update_user'] } },

      // { path: 'machines', component: MachinesSearchComponent, canActivate: [PermissionGuard], data: { permissions: ['search_machine'] } },
      // { path: 'machines/new', component: MachineCreateComponent, canActivate: [PermissionGuard], data: { permissions: ['create_machine'] } },

      // { path: 'errors', component: ErrorsHistoryComponent, canActivate: [PermissionGuard], data: { permissions: ['read_errors'] } },
      // kad je ulogovan, a ode na root → na korisnike
      { path: '', redirectTo: '/users', pathMatch: 'full' },
    ],
  },
  // ako lupi glup URL
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
