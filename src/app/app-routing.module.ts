import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';

// uvozimo komponente koje si već generisala
import { LoginComponent } from './components/login/login.component';
import { UsersListComponent } from './components/users/users-list/users-list.component';
import { UserFormComponent } from './components/users/user-form/user-form.component';
import { MachinesSearchComponent } from './components/machines/machines-search/machines-search.component';
import { MachineCreateComponent } from './components/machines/machine-create/machine-create.component';
import { ErrorsHistoryComponent } from './components/errors/errors-history/errors-history.component';
import { NoPermissionsComponent } from './components/shared/no-permissions/no-permissions.component';
import { AuthGuard } from './services/auth-guard.service';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
  path: '',
  canActivate: [AuthGuard],
  children: [
    { path: 'users', component: UsersListComponent},
    { path: 'users/new', component: UserFormComponent},
    { path: 'users/:id', component: UserFormComponent},

    { path: 'machines', component: MachinesSearchComponent },
    { path: 'machines/new', component: MachineCreateComponent},

    { path: 'errors', component: ErrorsHistoryComponent},
    // kad je ulogovan, a ode na root → na korisnike
    { path: '', redirectTo: '/login', pathMatch: 'full' }
    ]
  },
  // kad korisnik nema dozvolu
  { path: 'no-permissions', component: NoPermissionsComponent },

 // ako lupi glup URL
  { path: '**', redirectTo: '/login' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
