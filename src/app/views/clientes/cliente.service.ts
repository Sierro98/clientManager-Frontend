import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { Observable, map, catchError, throwError } from 'rxjs';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { Region } from './region';
@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private urlEndPoint: string = 'http://localhost:8080/api/clientes';

  constructor(private http: HttpClient, private router: Router) {}

  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(`${this.urlEndPoint}/regiones`);
  }

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
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/clientes']);
        }
        return throwError(() => e);
      })
    );
  }

  createCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post(this.urlEndPoint, cliente).pipe(
      catchError((e) => {
        if (e.status == 400) {
          return throwError(() => e);
        }
        return throwError(() => e);
      }),
      map((response: any) => response.cliente as Cliente)
    );
  }

  update(cliente: Cliente): Observable<Cliente> {
    return this.http.put(`${this.urlEndPoint}/${cliente.id}`, cliente).pipe(
      catchError((e) => {
        if (e.status == 400) {
          return throwError(() => e);
        }
        return throwError(() => e);
      }),
      map((response: any) => response.cliente as Cliente)
    );
  }

  delete(id: number): Observable<Cliente> {
    return this.http.delete(`${this.urlEndPoint}/${id}`).pipe(
      catchError((e) => {
        return throwError(() => e);
      }),
      map((response: any) => response.cliente as Cliente)
    );
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append('file', archivo);
    formData.append('id', id);

    const req = new HttpRequest(
      'POST',
      `${this.urlEndPoint}/uploadImg`,
      formData,
      {
        reportProgress: true,
      }
    );

    return this.http.request(req);
  }
}
