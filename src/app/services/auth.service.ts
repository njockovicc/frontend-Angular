import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { User } from '../models/user.model';
import { MOCK_USERS } from './mock-data';

const KEY_AUTH_USER = 'authUser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _authUserSubject: BehaviorSubject<User | null>;
  public authUser$: Observable<User | null>;

  constructor() {
    const storedUser = localStorage.getItem(KEY_AUTH_USER);
    this._authUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.authUser$ = this._authUserSubject.asObservable();
  }

  login(email: string, password: string): Observable<User> {
    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      this._authUserSubject.next(user);
      localStorage.setItem(KEY_AUTH_USER, JSON.stringify(user));
      return of(user);
    } else {
      return new Observable((observer) => {
        observer.error('Invalid credentials');
      });
    }
  }

  logout(): void {
    this._authUserSubject.next(null);
    localStorage.removeItem(KEY_AUTH_USER);
  }

  hasPermission(permission: string): Observable<boolean> {
    return this.authUser$.pipe(
      map((user) => user?.permissions.includes(permission) || false)
    );
  }
}
