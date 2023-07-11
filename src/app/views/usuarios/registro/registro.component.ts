import { Usuario } from './../usuario';
import { Component, OnInit } from '@angular/core';
import { ModalService } from './modal.service';
import { RegisterUser } from './register-user';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
})
export class RegistroComponent implements OnInit {
  hidePassword: boolean = true;
  hidePassword2: boolean = true;
  usuario: RegisterUser;
  passwordMatch: boolean = false;

  constructor(
    public modalService: ModalService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.usuario = new RegisterUser();
  }

  registrar() {
    if (
      this.usuario.password == this.usuario.matchingPassword &&
      this.usuario.username != null &&
      this.usuario.password != null &&
      this.usuario.matchingPassword != null &&
      this.usuario.nombre != null &&
      this.usuario.apellido != null &&
      this.usuario.email != null
    ) {
      this.usuario.role = 'ROLE_USER';
      this.authService.register(this.usuario).subscribe((response) => {
        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso!',
          text: 'Ya puede iniciar sesión con su nueva cuenta',
        });
        this.closeModal();
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Algo salió mal!',
      });
      this.closeModal();
    }
  }

  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }

  togglePassword2() {
    this.hidePassword2 = !this.hidePassword2;
  }

  closeModal() {
    this.modalService.closeModal();
  }

  checkPasswords() {
    if (this.usuario.password != this.usuario.matchingPassword) {
      this.passwordMatch = false;
    } else {
      this.passwordMatch = true;
    }
  }
}
