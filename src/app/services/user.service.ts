import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // ovo glumi bazu
  private users: User[] = [
    {
      id: 1,
      firstName: 'Admin',
      lastName: 'Admin',
      email: 'admin@raf.rs',
      password: this.hashPassword('admin'),
      permissions: ['create_user', 'read_user', 'update_user', 'delete_user', 'search_machine']
    },
    {
      id: 2,
      firstName: 'Pera',
      lastName: 'Peric',
      email: 'pera@raf.rs',
       password: this.hashPassword('pera'),
      permissions: ['read_user']
    },
    {
      id: 3,
      firstName: 'Zika',
      lastName: 'Zikic',
      email: 'zika@raf.rs',
       password: this.hashPassword('zika'),
      permissions: ['read_user', 'search_machine']
    }
  ];

   private hashPassword(pass: string): string {
    // samo simulacija
    let hash = 0;
    for (let i = 0; i < pass.length; i++) {
      hash = (hash << 5) - hash + pass.charCodeAt(i);
      hash |= 0;
    }
    return hash.toString();
  }

  getAll(): User[] {
    return this.users;
  }

  getById(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }

 private getNextId(): number {
  if (this.users.length === 0) {
    return 1;
  }
  const maxId = Math.max(...this.users.map(u => u.id));
  return maxId + 1;
}

// pomoćna za email
  private emailExists(email: string, ignoreId?: number): boolean {
    return this.users.some(u => u.email === email && u.id !== ignoreId);
  }

  create(user: User): { success: boolean; message?: string } {
    // email mora biti jedinstven
    if (this.emailExists(user.email)) {
      return { success: false, message: 'Korisnik sa tim emailom već postoji.' };
    }
    // password mora biti unet
    if (!user.password || user.password.trim() === '') {
      return { success: false, message: 'Lozinka je obavezna.' };
    }

    user.id = this.getNextId();
    user.password = this.hashPassword(user.password);
    this.users.push(user);
    return { success: true };
  }

  checkCredentials(email: string, password: string): User | null {
    const user = this.users.find(u => u.email === email);
    if (!user) return null;
    if (user.password === this.hashPassword(password)) {
      return user;
    }
    return null;
  }


  update(updated: User): { success: boolean; message?: string } {
    const index = this.users.findIndex(u => u.id === updated.id);
    if (index === -1) {
      return { success: false, message: 'Korisnik ne postoji.' };
    }

    // proveri jedinstven email, ali ignoriši ovog korisnika
    if (this.emailExists(updated.email, updated.id)) {
      return { success: false, message: 'Korisnik sa tim emailom već postoji.' };
    }

    // ako korisnik nije menjao lozinku (prazno), zadrži staru
    if (!updated.password || updated.password.trim() === '') {
      updated.password = this.users[index].password;
    }

    this.users[index] = updated;
    return { success: true };
  }

  delete(id: number) {
    this.users = this.users.filter(u => u.id !== id);
  }
}
