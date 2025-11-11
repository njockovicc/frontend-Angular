import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(private auth: AuthService) {}

  // osnovno
  getCurrentUser(): User | null {
    return this.auth.getCurrentUser();
  }

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  has(permission: string): boolean {
    const user = this.getCurrentUser();
    return !!user && Array.isArray(user.permissions) && user.permissions.includes(permission);
  }

  // često korišćene dozvole za korisnike
  canReadUsers(): boolean {
    return this.has('read_user');
  }

  canCreateUsers(): boolean {
    return this.has('create_user');
  }

  canUpdateUsers(): boolean {
    return this.has('update_user');
  }

  canDeleteUsers(): boolean {
    return this.has('delete_user');
  }

  // mašine
  canSearchMachines(): boolean {
    return this.has('search_machine');
  }

  canCreateMachine(): boolean {
    return this.has('create_machine');
  }

  // greške (u zadatku su vezane za mašine)
  canViewErrors(): boolean {
    // možeš ovde da promeniš na posebnu dozvolu ako je uvedeš
    return this.canSearchMachines();
  }

  // da li vidi tuđe mašine
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    // ti već imaš admin@raf.rs u mocku pa ćemo tako
    return !!user && user.email === 'admin@raf.rs';
  }

  getCurrentUserId(): number | null {
    const user = this.getCurrentUser();
    return user ? user.id : null;
  }
}
