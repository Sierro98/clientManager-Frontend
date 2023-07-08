import { Component } from '@angular/core';
import { ModalService } from './modal.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
})
export class RegistroComponent {
  hidePassword: boolean = true;
  hidePassword2: boolean = true;

  constructor(public modalService: ModalService) {}

  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }

  togglePassword2() {
    this.hidePassword2 = !this.hidePassword2;
  }

  closeModal() {
    this.modalService.closeModal();
  }
}
