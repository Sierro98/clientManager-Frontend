import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  urlEndPoint: string = 'http://localhost:8080/oauth/token';
  credentials: string = btoa('angularapp' + ':' + '12345');
  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: 'Basic ' + this.credentials,
  });
  private _user: Usuario;
  private _token: string;
  constructor(private http: HttpClient) {}

  login(usuario: Usuario): Observable<any> {
    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.username);
    params.set('password', usuario.password);

    return this.http.post<any>(this.urlEndPoint, params.toString(), {
      headers: this.headers,
    });
  }

  saveUser(accessToken: string): void {
    let payload = this.getDataToken(accessToken);
    this._user = new Usuario();
    this._user.username = payload.nombre;
    this._user.apellido = payload.apellido;
    this._user.email = payload.email;
    this._user.username = payload.user_name;
    this._user.roles = payload.authorities;
    sessionStorage.setItem('user', JSON.stringify(this._user));
  }

  saveToken(accessToken: string): void {
    this._token = accessToken;
    sessionStorage.setItem('token', accessToken);
  }

  getDataToken(accessToken: string): any {
    if (accessToken != null) {
      return JSON.parse(atob(accessToken.split('.')[1]));
    } else if (sessionStorage.getItem('token') != null) {
      return JSON.parse(atob(sessionStorage.getItem('token').split('.')[1]));
    }
    return null;
  }

  isAuthenticated(): boolean {
    let payload = this.getDataToken(this._token);
    if (payload != null && payload.user_name && payload.user_name.length > 0) {
      return true;
    }
    return false;
  }

  logout(): void {
    this._token = null;
    this._user = null;
    sessionStorage.clear();
  }

  hasRole(role: string): boolean {
    if (this.user.roles.includes(role)) {
      return true;
    }
    return false;
  }

  get user(): Usuario {
    if (this._user != null) {
      return this._user;
    } else if (this._user == null && sessionStorage.getItem('user') != null) {
      this._user = JSON.parse(sessionStorage.getItem('user')) as Usuario;
      return this._user;
    }
    return new Usuario();
  }

  get token(): string {
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && sessionStorage.getItem('token') != null) {
      this._token = sessionStorage.getItem('token');
      return this._token;
    }
    return null;
  }
}
