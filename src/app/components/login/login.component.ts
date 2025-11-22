import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  password = '';
  errorMsg = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService
      .login(this.email, this.password)
      .pipe(first())
      .subscribe({
        next: () => {
          this.errorMsg = '';
          this.router.navigate(['/users']);
        },
        error: (error) => {
          this.errorMsg = 'Pogrešan email ili lozinka';
          console.error(error);
        },
      });
  }
}
