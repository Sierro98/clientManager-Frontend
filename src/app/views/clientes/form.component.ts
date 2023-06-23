import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
})
export class FormComponent implements OnInit {
  cliente: Cliente = new Cliente();
  titulo: string = 'Crear Cliente';
  errors: string[];

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit() {
    this.cargarCliente();
  }

  cargarCliente(): void {
    this.activatedRoute.params.subscribe((params) => {
      let id = params['id'];
      if (id) {
        this.clienteService
          .getCliente(id)
          .subscribe((cliente) => (this.cliente = cliente));
      }
    });
  }

  create() {
    this.clienteService.createCliente(this.cliente).subscribe(
      (cliente) => {
        this.router.navigate(['/clientes']);
        Swal.fire(
          'Nuevo Cliente',
          `Cliente ${cliente.nombre} ${cliente.apellido} creado con exito`,
          'success'
        );
      },
      (err) => {
        this.errors = err.error.errors as string[];
      }
    );
  }

  update(): void {
    this.clienteService.update(this.cliente).subscribe(
      (cliente) => {
        this.router.navigate(['/clientes']);
        Swal.fire(
          'Cliente Actualizado',
          `Cliente ${cliente.nombre} ${cliente.apellido} actualizado con exito`,
          'success'
        );
      },
      (err) => {
        this.errors = err.error.errors as string[];
      }
    );
  }
}
