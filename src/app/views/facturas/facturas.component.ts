import { Component, OnInit } from '@angular/core';
import { Factura } from './models/factura';
import { ClienteService } from '../clientes/cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable, flatMap, map, mergeMap, startWith } from 'rxjs';
import { FacturaService } from './services/factura.service';
import { Producto } from './models/producto';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ItemFactura } from './models/item-factura';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.scss'],
})
export class FacturasComponent implements OnInit {
  titulo: string = 'Nueva Facturas';
  factura: Factura = new Factura();
  autocompleteControl = new FormControl();
  productosFiltrados: Observable<Producto[]>;

  constructor(
    private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute,
    private facturaService: FacturaService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      let clienteId = +params.get('clienteId');
      this.clienteService.getCliente(clienteId).subscribe({
        next: (cliente) => {
          this.factura.cliente = cliente;
        },
        error: (err) => {
          this.factura.cliente = null;
        },
      });
    });
    this.productosFiltrados = this.autocompleteControl.valueChanges.pipe(
      map((value) => (typeof value === 'string' ? value : value.nombre)),
      mergeMap((value) => (value ? this._filter(value) : []))
    );
  }
  displayFn(user: string): string {
    return user && user ? user : '';
  }

  private _filter(name: string): Observable<Producto[]> {
    const filterValue = name.toLowerCase();
    if (!this.isBlank(name)) {
      return this.facturaService.filtrarProductos(name);
    } else
      return new Observable<Producto[]>((observer) => {
        observer.next([]);
      });
  }

  mostrarNombre(producto?: Producto): string | undefined {
    return producto ? producto.nombre : '';
  }

  seleccionarProducto(event: MatAutocompleteSelectedEvent): void {
    let producto = event.option.value as Producto;

    let nuevoItem = new ItemFactura();
    nuevoItem.producto = producto;
    let id = nuevoItem.producto.id;
    if (this.existeItem(id)) {
      this.factura.items = this.factura.items.map((item: ItemFactura) => {
        if (id === item.producto.id) {
          ++item.cantidad;
        }
        return item;
      });
    } else {
      this.factura.items.push(nuevoItem);
    }

    this.autocompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();
  }

  actualizarCantidad(id: number, event): void {
    let cantidad: number = event.target.value as number;
    if (cantidad == 0) {
      return this.eliminarItemFactura(id);
    }
    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if (id === item.producto.id) {
        item.cantidad = cantidad;
      }
      return item;
    });
  }

  eliminarItemFactura(id: number): void {
    this.factura.items = this.factura.items.filter(
      (item: ItemFactura) => id !== item.producto.id
    );
  }

  eliminarItem(id: number): void {
    this.eliminarItemFactura(id);
  }

  totalFactura(): number {
    return this.factura.items
      .reduce(
        (total: number, item: ItemFactura) => total + item.calcularImporte(),
        0
      )
      .toFixed(2) as any;
  }

  crearFactura(): void {
    this.facturaService.createFactura(this.factura).subscribe({
      next: (factura) => {
        Swal.fire(
          'Nueva Factura',
          `Factura ${factura.descripcion} creada con éxito`,
          'success'
        );
        this.factura = new Factura();
        this.router.navigate(['/clientes']);
      },
      error: (err) => {
        Swal.fire(
          'Nueva Factura',
          `Error al crear la factura: ${err.error.error}`,
          'error'
        );
      },
    });
  }

  private existeItem(id: number): boolean {
    let existe = false;
    this.factura.items.forEach((item: ItemFactura) => {
      if (id === item.producto.id) {
        existe = true;
      }
    });
    return existe;
  }

  private isBlank(str: string): boolean {
    return /^\s*$/.test(str);
  }
}
