import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private env: string;

  constructor(private _http: HttpClient, private _router: Router) {
    this.env = environment.APP_URL;
  }

  REGISTER_CLIENT(client: any) {
    return this._http.post<any>(this.env + 'client/registerClient', client);
  }

  login(client: any) {
    return this._http.post<any>(this.env + 'client/login', client);
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAdmin() {
    return localStorage.getItem('role') === 'admin' ? true : false;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this._router.navigate(['/login']);
  }
}
