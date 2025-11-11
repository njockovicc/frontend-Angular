// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';

  constructor(private userService: UserService) {}

  login(email: string, password: string): boolean {
    const user = this.userService.checkCredentials(email, password);
    if (!user) {
      return false;
    }

    // ovde je "fejk" token – samo string da imamo nešto
    const fakeToken = btoa(email + ':' + Date.now());

    localStorage.setItem(this.tokenKey, fakeToken);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    return true;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): User | null {
    const data = localStorage.getItem(this.userKey);
    return data ? (JSON.parse(data) as User) : null;
  }
}
