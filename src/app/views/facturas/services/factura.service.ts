import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Factura } from '../models/factura';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root',
})
export class FacturaService {
  private urlEndpoint: string = 'http://localhost:8080/api/facturas';

  constructor(private http: HttpClient) {}

  getFactura(id: number): Observable<Factura> {
    return this.http.get<Factura>(`${this.urlEndpoint}/${id}`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlEndpoint}/${id}`);
  }

  filtrarProductos(term: string): Observable<Producto[]> {
    return this.http
      .get(`${this.urlEndpoint}/filtrar-producto/${term}`)
      .pipe(map((response: any) => response as Producto[]));
  }

  createFactura(factura: Factura): Observable<Factura> {
    return this.http.post<Factura>(this.urlEndpoint, factura);
  }
}
