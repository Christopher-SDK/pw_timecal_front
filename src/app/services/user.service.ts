import { HttpClient } from '@angular/common/http';
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
    @Inject(PLATFORM_ID) private platformId: Object // Injecting PLATFORM_ID to check the platform
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
            // Browser check
            localStorage.setItem('token', res.jwtToken);
            localStorage.setItem('user_id', res.id.toString());

            // Fetch user details and store additional user data
            this.getUser(res.id).subscribe((user) => {
              localStorage.setItem('user_type', user.type); // Store user role/type
              localStorage.setItem('business_id', user.businessId.toString());
            });
          }
        })
      );
  }

  getCurrentUserId(): number | null {
    if (isPlatformBrowser(this.platformId)) {
      const userId = localStorage.getItem('user_id');
      return userId !== null ? parseInt(userId) : null;
    }
    return null;
  }

  getCurrentToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      return token !== null ? token : null;
    }
    return null;
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }
  }
}
