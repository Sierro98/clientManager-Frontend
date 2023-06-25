import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { Observable, map, catchError, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private urlEndPoint: string = 'http://localhost:8080/api/clientes';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private router: Router) {}

  /* getClientes(): Observable<Cliente[]> {
    return this.http.get(this.urlEndPoint).pipe(
      map((response) => {
        let clientes = response as Cliente[];
        return clientes.map((cliente) => {
          //cliente.createAt = formatDate(cliente.createAt, 'fullDate', 'es');
          return cliente;
        });
      })
    );
  } */

  getClientes(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      map((response: any) => {
        (response.content as Cliente[]).map((cliente) => {
          return cliente;
        });
        return response;
      })
    );
  }

  getCliente(id: number): Observable<Cliente> {
    return this.http.get(`${this.urlEndPoint}/${id}`).pipe(
      map((response: any) => response as Cliente),
      catchError((e) => {
        this.router.navigate(['/clientes']);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(() => e);
      })
    );
  }

  createCliente(cliente: Cliente): Observable<Cliente> {
    return this.http
      .post(this.urlEndPoint, cliente, { headers: this.httpHeaders })
      .pipe(
        catchError((e) => {
          if (e.status == 400) {
            return throwError(() => e);
          }
          Swal.fire(e.error.mensaje, e.error.error, 'error');
          return throwError(() => e);
        }),
        map((response: any) => response.cliente as Cliente)
      );
  }

  update(cliente: Cliente): Observable<Cliente> {
    return this.http
      .put(`${this.urlEndPoint}/${cliente.id}`, cliente, {
        headers: this.httpHeaders,
      })
      .pipe(
        catchError((e) => {
          if (e.status == 400) {
            return throwError(() => e);
          }
          Swal.fire(e.error.mensaje, e.error.error, 'error');
          return throwError(() => e);
        }),
        map((response: any) => response.cliente as Cliente)
      );
  }

  delete(id: number): Observable<Cliente> {
    return this.http
      .delete(`${this.urlEndPoint}/${id}`, {
        headers: this.httpHeaders,
      })
      .pipe(
        catchError((e) => {
          Swal.fire(e.error.mensaje, e.error.error, 'error');
          return throwError(() => e);
        }),
        map((response: any) => response.cliente as Cliente)
      );
  }
}
