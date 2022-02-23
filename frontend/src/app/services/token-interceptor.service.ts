import { HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClientService } from './client.service';

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private _clientService: ClientService) {}
  intercept(req: any, next: any) {
    const tokenReq = req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + this._clientService.getToken(),
      },
    });
    return next.handle(tokenReq);
  }
}
