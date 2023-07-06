import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}
  // error 401 es no autorizado mientras que 403 es prohibido
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((e) => {
        if (e.status == 401) {
          if (this.authService.isAuthenticated()) {
            this.authService.logout();
          }
          this.router.navigate(['/login']);
        }
        if (e.status == 403) {
          Swal.fire(
            'Acceso denegado',
            `El usuario: ${this.authService.user.username} no tienes acceso a esta función`,
            'warning'
          );
          this.router.navigate(['/clientes']);
        }
        return throwError(() => e);
      })
    );
  }
}
