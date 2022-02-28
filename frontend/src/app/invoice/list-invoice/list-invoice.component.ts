import { Component, OnInit } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { InvoiceService } from 'src/app/services/invoice.service';
@Component({
  selector: 'app-list-invoice',
  templateUrl: './list-invoice.component.html',
  styleUrls: ['./list-invoice.component.scss'],
})
export class ListInvoiceComponent implements OnInit {
  invoiceData: any;
  invoiceSt: any;
  message: string = '';
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  durationInSeconds: number = 2;

  constructor(
    private _invoiceService: InvoiceService,
    private _snackBar: MatSnackBar
  ) {
    this.invoiceData = {};
    this.invoiceSt = [];
  }

  ngOnInit(): void {
    this._invoiceService.LIST_INVOICE().subscribe({
      next: (v) => {
        this.invoiceData = v.invoiceList;
        this.invoiceData.forEach((st: any) => {
          if (st.invoiceStatus === 'primerrecordatorio') {
            this.invoiceSt.push(st);
          }
          if (st.invoiceStatus === 'segundorecordatorio') {
            this.invoiceSt.push(st);
          }
          if (st.invoiceStatus === 'desactivado') {
            this.invoiceSt.push(st);
          }
        });
      },
      error: (e) => {
        this.message = e.error.message;
        this.openSnackBarError();
      },
      complete: () => console.info('Completado'),
    });
  }

  UPDATE_INVOICE(invoice: any, status: string) {
    let tempStatus = invoice.invoiceStatus;
    invoice.invoiceStatus = status;
    this._invoiceService.UPDATE_INVOICE(invoice).subscribe({
      next: (v) => {
        invoice.status = status;
        this.resetList();
      },
      error: (e) => {
        invoice.status = tempStatus;
        this.message = e.error.message;
        this.openSnackBarError();
      },
      complete: () => console.info('Completado'),
    });
  }

  resetList() {
    this.invoiceSt = [];
    this._invoiceService.LIST_INVOICE().subscribe({
      next: (v) => {
        this.invoiceData = v.invoiceList;
        this.invoiceData.forEach((st: any) => {
          if (st.invoiceStatus === 'primerrecordatorio') {
            this.invoiceSt.push(st);
          }
          if (st.invoiceStatus === 'segundorecordatorio') {
            this.invoiceSt.push(st);
          }
          if (st.invoiceStatus === 'desactivado') {
            this.invoiceSt.push(st);
          }
        });
      },
      error: (e) => {
        this.message = e.error.message;
        this.openSnackBarError();
      },
      complete: () => console.info('Completado'),
    });
  }

  DELETE_INVOICE(invoice: any) {
    this._invoiceService.DELETE_INVOICE(invoice).subscribe({
      next: (v) => {
        let index = this.invoiceData.indexOf(invoice);
        if (index > -1) {
          this.invoiceData.splice(index, 1);
          this.message = v.message;
          this.openSnackBarSuccesfull();
        }
      },
      error: (e) => {
        this.message = e.error.message;
        this.openSnackBarError();
      },
      complete: () => console.info('Completado'),
    });
    location.reload()
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