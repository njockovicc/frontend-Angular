import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const requiredPermissions = next.data['permissions'] as string[];

    return this.authService.authUser$.pipe(
      first(),
      map((user) => {
        if (!user || !user.permissions.length) {
          this.router.navigate(['/no-permissions']);
          return false;
        }

        const hasRequiredPermissions = requiredPermissions.every((permission) =>
          user.permissions.includes(permission)
        );

        if (hasRequiredPermissions) {
          return true;
        } else {
          this.router.navigate(['/no-permissions']);
          return false;
        }
      })
    );
  }
}
