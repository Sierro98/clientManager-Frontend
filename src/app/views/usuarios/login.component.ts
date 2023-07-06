import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { Usuario } from './usuario';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  titulo: string = 'Por favor Inicie sesión!';
  usuario: Usuario;
  hidePassword: boolean = true;

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

  constructor(
    private authService: AuthService,
    private router: Router,
    private renderer: Renderer2
  ) {
    this.usuario = new Usuario();
  }
  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      Swal.fire(
        'Login',
        'Ya está registrado con la cuenta: ' + this.authService.user.username,
        'info'
      );
      this.router.navigate(['/clientes']);
    }
  }

  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }

  login(): void {
    if (
      this.usuario.username == null ||
      this.usuario.password == null ||
      this.usuario.username.replaceAll(' ', '').length == 0 ||
      this.usuario.password.replaceAll(' ', '').length == 0
    ) {
      Swal.fire('Error Login', 'Username o password vacías!', 'error');
      return;
    } else {
      this.authService.login(this.usuario).subscribe(
        async (response) => {
          this.authService.saveUser(response.access_token);
          this.authService.saveToken(response.access_token);

          this.router.navigate(['/clientes']);
          await this.Toast.fire({
            icon: 'success',
            title: 'Success',
          });
        },
        (err) => {
          if (err.status == 400) {
            Swal.fire(
              'Error Login',
              'Username o password incorrectas!',
              'error'
            );
          }
        }
      );
    }
  }
}
