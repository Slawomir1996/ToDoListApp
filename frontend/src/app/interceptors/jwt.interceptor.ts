import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthenticationService, JWT_NAME } from '../services/authentication-service/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class JwtInterceptor implements HttpInterceptor {
  
  constructor(private authService: AuthenticationService) { }
  
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
    ): Observable<HttpEvent<any>> {
      const token = localStorage.getItem(JWT_NAME);
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 401) {
          this.authService.logout();
        }
        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }
}


  // intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
  //   const token = localStorage.getItem(JWT_NAME);
  //   if (token) {
  //     const cloneReq = request.clone({ headers: request.headers.set('Autorization', 'Bearer' + token) });
  //     console.log(cloneReq);
  //     return next.handle(cloneReq);
  //   } else {
  //     console.log(request);
  //     return next.handle(request);
  //   }

  // }
