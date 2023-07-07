import { Component, Input, OnInit } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import Swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { ModalService } from './modal.service';
import { AuthService } from '../../usuarios/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  @Input()
  cliente: Cliente;
  fotoSeleccionada: File;
  progress: number = 0;

  constructor(
    private clienteService: ClienteService,
    public modalService: ModalService,
    public authService: AuthService
  ) {}
  ngOnInit() {
    console.log(this.cliente);

  }

  seleccionarFoto(event) {
    this.fotoSeleccionada = event.target.files[0];
    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
      Swal.fire('Error', 'El archivo debe ser del tipo imagen', 'error');
      this.fotoSeleccionada = null;
    }
  }

  subirFoto() {
    if (!this.fotoSeleccionada) {
      Swal.fire('Error', 'Debe seleccionar una foto', 'error');
    } else {
      this.clienteService
        .subirFoto(this.fotoSeleccionada, this.cliente.id)
        .subscribe((event) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round((event.loaded / event.total) * 100);
          } else if (event.type === HttpEventType.Response) {
            let response: any = event.body;
            this.cliente = response.cliente as Cliente;
            this.modalService.uploadNotifier.emit(this.cliente);
            Swal.fire(
              response.mensaje,
              `La foto se ha subido con exito ${this.cliente.profilePicture}`,
              'success'
            );
            this.progress = 0;
          }
        });
    }
  }

  closeModal() {
    this.modalService.closeModal();
    this.fotoSeleccionada = null;
    this.progress = 0;
  }
}
