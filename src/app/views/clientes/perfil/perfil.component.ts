import { Component, Input, OnInit } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import Swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { ModalService } from './modal.service';
import { AuthService } from '../../usuarios/auth.service';
import { Factura } from '../../facturas/models/factura';
import { FacturaService } from '../../facturas/services/factura.service';

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
    public authService: AuthService,
    private facturaService: FacturaService
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

  delete(factura: Factura) {
    Swal.fire({
      title: '¿Está seguro?',
      text: `¿Seguro que desea eliminar la factura ${factura.descripcion}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',

      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
    }).then((result) => {
      if (result.value) {
        this.facturaService.delete(factura.id).subscribe({
          next: (response) => {
            this.cliente.listaFactura = this.cliente.listaFactura.filter(
              (f) => f !== factura
            );
            Swal.fire(
              'Factura eliminada!',
              `Factura ${factura.descripcion} eliminada con éxito.`,
              'success'
            );
          },
        });
      }
    });
  }
}
