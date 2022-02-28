import { Component, OnInit } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  registerData: any;
  loginData: any;
  message: string = '';
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  durationInSeconds: number = 2;
  hide = true;

  constructor(
    private _clientService: ClientService,
    private _router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.registerData = {};
    this.loginData = {};
  }

  ngOnInit(): void {}

  REGISTER_CLIENT() {
    if (
      !this.registerData.name ||
      !this.registerData.email ||
      !this.registerData.password ||
      !this.registerData.city ||
      !this.registerData.street ||
      !this.registerData.state ||
      !this.registerData.zip ||
      !this.registerData.nit
    ) {
      this.message = 'Error: datos incompletos';
      this.openSnackBarError();
    } else {
      this._clientService.REGISTER_CLIENT(this.registerData).subscribe({
        next: (v) => {
          localStorage.setItem('token', v.token);
          this._router.navigate(['/save']);
          this.message = 'Registro completado';
          this.openSnackBarSuccesfull();
          this.registerData = {};
        },
        error: (e) => {
          this.message = e.error.message;
          this.openSnackBarError();
        },
        complete: () => console.info('Registro completado'),
      });
    }
  }

  login() {
    if (!this.loginData.email || !this.loginData.password) {
      this.message = 'Error: datos incompletos';
      this.openSnackBarError();
      this.loginData = {};
    } else {
      this._clientService.login(this.loginData).subscribe({
        next: (v) => {
          localStorage.setItem('token', v.token);
          this._router.navigate(['/list']);
          this.loginData = {};
        },
        error: (e) => {
          this.message = e.error.message;
          this.openSnackBarError();
        },
        complete: () => console.info('Bienvenido'),
      });
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

  CLICK_IN() {
    var signInBtn = document.getElementById('signIn') as HTMLButtonElement;
    var container = document.getElementById('container') as HTMLDivElement;
    signInBtn.addEventListener('click', () => {
      container.classList.remove('right-panel-active');
    });
  }

  CLICK_UP() {
    var signUpBtn = document.getElementById('signUp') as HTMLButtonElement;
    var container = document.getElementById('container') as HTMLDivElement;
    signUpBtn.addEventListener('click', () => {
      container.classList.add('right-panel-active');
    });
  }
}
