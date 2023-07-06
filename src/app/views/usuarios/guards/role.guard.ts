import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let role = next.data['role'] as string;
    if (this.authService.isAuthenticated()) {
      return true;
    } else if (this.authService.hasRole(role)) {
      return true;
    } else {
      Swal.fire(
        'Acceso denegado',
        `El usuario: ${this.authService.user.username} no tienes acceso a esta función`,
        'warning'
      );
      this.router.navigate(['/clientes']);
      return false;
    }
  }
}
