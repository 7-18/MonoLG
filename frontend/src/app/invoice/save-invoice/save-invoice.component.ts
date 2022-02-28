import { Component, OnInit } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { InvoiceService } from 'src/app/services/invoice.service';

@Component({
  selector: 'app-save-invoice',
  templateUrl: './save-invoice.component.html',
  styleUrls: ['./save-invoice.component.scss'],
})
export class SaveInvoiceComponent implements OnInit {
  registerInvoice: any;
  message: string = '';
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  durationInSeconds: number = 2;

  constructor(
    private _invoiceService: InvoiceService,
    private _router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.registerInvoice = {};
  }

  ngOnInit(): void {}

  SAVE_INVOICE() {
    if (
      !this.registerInvoice.invoiceCode ||
      !this.registerInvoice.subtotal ||
      !this.registerInvoice.iva ||
      !this.registerInvoice.invoice_date
    ) {
      this.message = 'Error en el proceso: datos incompletos';
      this.openSnackBarError();
    } else {
      this._invoiceService.SAVE_INVOICE(this.registerInvoice).subscribe(
        (res) => {
          this._router.navigate(['/list-invoices']);
          this.message = 'Factura creada correctamente';
          this.openSnackBarSuccesfull();
          this.registerInvoice = {};
        },
        (err) => {
          this.message = err.error;
          this.openSnackBarError();
        }
      );
    }
  }

  openSnackBarSuccesfull() {
    this._snackBar.open(this.message, 'X', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: this.durationInSeconds * 1000,
      panelClass: ['style-snackBarTrue'],
    });
  }

  openSnackBarError() {
    this._snackBar.open(this.message, 'X', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: this.durationInSeconds * 1000,
      panelClass: ['style-snackBarFalse'],
    });
  }
}
