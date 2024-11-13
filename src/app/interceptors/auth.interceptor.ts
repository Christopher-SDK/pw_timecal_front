import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable() // Asegúrate de tener este decorador aquí
export class AuthInterceptor implements HttpInterceptor {

  constructor(private userService: UserService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    let token = this.userService.getCurrentToken();
    if (token) {
      let clonedRequest = request.clone({
        headers: request.headers.set("Authorization", "Bearer " + token)
      });
      return next.handle(clonedRequest);
    }

    return next.handle(request);
  }
}
