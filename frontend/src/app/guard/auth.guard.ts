import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ClientService } from '../services/client.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private _clientService: ClientService, private _router: Router) {}

  canActivate(): boolean {
    if (!this._clientService.loggedIn()) {
      this._router.navigate(['/login']);
      return false;
    } else {
      return true;
    }
  }
}
