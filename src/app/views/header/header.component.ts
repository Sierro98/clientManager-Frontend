import { Component } from '@angular/core';
import { AuthService } from '../usuarios/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {

  Toast = Swal.mixin({
    toast: true,
    position: 'bottom-right',
    iconColor: 'white',
    customClass: {
      popup: 'colored-toast',
    },
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });

  constructor(public authService: AuthService, private router: Router) {}

  async logout(): Promise<void> {
    this.authService.logout();
    this.router.navigate(['/clientes']);
    await this.Toast.fire({
      icon: 'warning',
      title: 'Logout exitoso',
    })
  }
}
