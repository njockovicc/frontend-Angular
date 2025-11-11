import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { UsersListComponent } from './components/users/users-list/users-list.component';
import { UserFormComponent } from './components/users/user-form/user-form.component';
import { MachinesSearchComponent } from './components/machines/machines-search/machines-search.component';
import { MachineCreateComponent } from './components/machines/machine-create/machine-create.component';
import { ErrorsHistoryComponent } from './components/errors/errors-history/errors-history.component';
import { NoPermissionsComponent } from './components/shared/no-permissions/no-permissions.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UsersListComponent,
    UserFormComponent,
    MachinesSearchComponent,
    MachineCreateComponent,
    ErrorsHistoryComponent,
    NoPermissionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
