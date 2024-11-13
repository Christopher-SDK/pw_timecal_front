import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { User } from '../models/user';
import { Token } from '../models/token';
import { tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  ruta_servidor = 'https://timecalappnew.azurewebsites.net/api';
  recurso = 'users';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object // Inyección de PLATFORM_ID
  ) {}

  getUser(id: number) {
    return this.http.get<User>(`${this.ruta_servidor}/${this.recurso}/${id}`);
  }

  addUser(user: User) {
    return this.http.post<User>(
      `${this.ruta_servidor}/${this.recurso}/register`,
      user,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  login(credentials: Partial<User>) {
    return this.http
      .post<Token>(`${this.ruta_servidor}/${this.recurso}/login`, credentials)
      .pipe(
        tap((res) => {
          if (isPlatformBrowser(this.platformId)) {
            // Verifica si está en el navegador
            localStorage.setItem('token', res.jwtToken);
            localStorage.setItem('user_id', res.id.toString());

            // Llamada adicional para obtener los detalles completos del usuario
            this.getUser(res.id).subscribe((user) => {
              localStorage.setItem('user_type', user.type); // Almacena el rol (type) del usuario
              localStorage.setItem('business_id', user.businessId.toString());
            });
          }
        })
      );
  }

  getCurrentUserId(): number | null {
    if (isPlatformBrowser(this.platformId)) {
      // Verifica si está en el navegador
      const userId = localStorage.getItem('user_id');
      return userId !== null ? parseInt(userId) : null;
    }
    return null;
  }

  getCurrentToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      // Verifica si está en el navegador
      const token = localStorage.getItem('token');
      return token !== null ? token : null;
    }
    return null;
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      // Verifica si está en el navegador
      localStorage.clear();
    }
  }
}
