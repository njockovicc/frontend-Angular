// src/app/components/login/login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMsg = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(): void {
    const ok = this.auth.login(this.email, this.password);
    if (ok) {
      this.router.navigate(['/users']); // ili na dashboard
    } else {
      this.errorMsg = 'Pogrešan email ili lozinka';
    }
  }
}
