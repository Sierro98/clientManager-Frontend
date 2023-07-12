import { Component, OnInit } from '@angular/core';
import { FacturaService } from './services/factura.service';
import { ActivatedRoute } from '@angular/router';
import { Factura } from './models/factura';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss'],
})
export class DetalleComponent implements OnInit {
  titulo: string = 'Factura';
  factura: Factura;
  constructor(
    private facturaService: FacturaService,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        let id: number = +params.get('id');
        this.facturaService.getFactura(id).subscribe((factura) => {
          this.factura = factura;
        });
      },
      error: (err) => {
        this.titulo = 'Error al cargar la factura';
        console.log(err);
      },
    });
  }
}
