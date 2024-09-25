import { ToasterService } from './toaster/toaster.service';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiError } from '../backend/models';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private toasterService: ToasterService, private router: Router) {}

  intercept(req: HttpRequest<any>,next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg = '';
        console.log(error);
        if (error.error instanceof ErrorEvent) {
          console.log('this is client side error');
          errorMsg = `Error: ${error.error.message}`;
        } else {
          console.log(`this is server side error`);

          // delete only gives back a string, we try to make a json out of it before analysis
          let parsedError: ApiError | null = null;
          if (error.error != null && (typeof error.error == 'string') && error.error.includes("code")) {
            parsedError = JSON.parse(error.error.toString());
          }

          // Gateway Errors because of backend deployment
          if (error.status == 502 || error.status == 503 || error.status == 504) {
            this.toasterService.warn("Maintenance", "It seems a maintenance is currently going on.");

            setTimeout(() => {
              this.router.navigate(['maintenance']);
            }, 3000);
          }

          // get error data
          if (parsedError != null) {
            errorMsg = `Error Code: ${parsedError.code}, Message: ${parsedError.errorMessage}`;
          } else if (error.error != null && error.error.code != null && error.error.errorMessage != null) {
            errorMsg = `Error Code: ${error.error.code}, Message: ${error.error.errorMessage}`;
          } else {
            errorMsg = `Error: ${error.statusText}`;
          }
        }
        console.log("throw error with error message: ", errorMsg);
        return throwError(() => errorMsg);
      })
    );
  }
}
