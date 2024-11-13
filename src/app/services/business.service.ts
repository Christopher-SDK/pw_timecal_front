import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Business } from '../models/business';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  private rutaServidor = 'https://timecalappnew.azurewebsites.net/api';
  private recurso = 'businesses';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    let token = '';
    
    if (this.isBrowser()) { // Verificamos si estamos en el cliente
      token = localStorage.getItem('token') || '';
    }
  
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });
  }
  
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
  
  

  getAllBusinesses(): Observable<Business[]> {
    return this.http.get<Business[]>(`${this.rutaServidor}/${this.recurso}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getBusinessById(id: number): Observable<Business> {
    return this.http.get<Business>(`${this.rutaServidor}/${this.recurso}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  createBusiness(businessData: Business): Observable<Business> {
    return this.http.post<Business>(
      `${this.rutaServidor}/${this.recurso}`,
      businessData,
      { headers: this.getAuthHeaders() }
    );
  }

  updateBusiness(id: number, businessData: Business): Observable<Business> {
    return this.http.put<Business>(
      `${this.rutaServidor}/${this.recurso}/${id}`,
      businessData,
      { headers: this.getAuthHeaders() }
    );
  }

  deleteBusiness(id: number): Observable<void> {
    return this.http.delete<void>(`${this.rutaServidor}/${this.recurso}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
