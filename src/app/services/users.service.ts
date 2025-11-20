import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.model';
import { MOCK_USERS } from './mock-data';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private users: User[] = MOCK_USERS;

  constructor() {}

  getUsers(): Observable<User[]> {
    return of(this.users);
  }

  getUser(id: string): Observable<User | undefined> {
    const user = this.users.find((u) => u.id === id);
    return of(user);
  }

  createUser(user: Omit<User, 'id'>): Observable<User> {
    const newUser: User = {
      ...user,
      id: (Math.max(...this.users.map((u) => +u.id)) + 1).toString(),
    };
    this.users.push(newUser);
    return of(newUser);
  }

  updateUser(updatedUser: User): Observable<User> {
    const index = this.users.findIndex((u) => u.id === updatedUser.id);
    if (index !== -1) {
      this.users[index] = updatedUser;
    }
    return of(updatedUser);
  }

  deleteUser(id: string): Observable<void> {
    this.users = this.users.filter((u) => u.id !== id);
    return of(undefined);
  }
}
