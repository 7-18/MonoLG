import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private env: string;
  constructor(private _http: HttpClient) {    this.env = environment.APP_URL; }
  
  SAVE_INVOICE(invoice: any) {
    return this._http.post<any>(this.env + 'invoice/saveInvoice', invoice);
  }

  LIST_INVOICE() {
    return this._http.get<any>(this.env + 'invoice/listInvoice');
  }

  UPDATE_INVOICE(invoice: any) {
    return this._http.put<any>(this.env + 'invoice/updateInvoice', invoice);
  }

  DELETE_INVOICE(invoice: any) {
    return this._http.delete<any>(this.env + 'invoice/deleteInvoice/' + invoice._id);
  }
}
