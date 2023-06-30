import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from './perfil/modal.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[];
  paginator: any;
  selectedClient: Cliente;

  constructor(
    private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params) => {
      let page: number = +params.get('page');
      if (!page) {
        page = 0;
      }
      this.clienteService.getClientes(page).subscribe((response) => {
        this.clientes = response.content as Cliente[];
        this.paginator = response;
      });
    });
    this.modalService.uploadNotifier.subscribe((cliente) => {
      this.clientes = this.clientes.map((clienteOriginal) => {
        if (cliente.id == clienteOriginal.id) {
          clienteOriginal.profilePicture = cliente.profilePicture;
        }
        return clienteOriginal;
      });
    });
  }

  delete(cliente: Cliente) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: '¿Está Seguro?',
        text: `Seguro quiere eliminar al cliente ${cliente.nombre} ${cliente.apellido}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.clienteService.delete(cliente.id).subscribe((response) => {
            this.clientes = this.clientes.filter((cli) => cli !== cliente);
            swalWithBootstrapButtons.fire(
              'Cliente Eliminado!',
              `El cliente ${cliente.nombre} ${cliente.apellido} ha sido eliminado`,
              'success'
            );
          });
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelado',
            `No se ha eliminado a ${cliente.nombre} ${cliente.apellido}`,
            'error'
          );
        }
      });
  }

  openModal(cliente: Cliente) {
    this.selectedClient = cliente;
    this.modalService.openModal();
  }

}
