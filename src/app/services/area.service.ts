import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Area } from '../models/area';

@Injectable({
  providedIn: 'root'
})
export class AreaService {
  private rutaServidor = 'https://timecalappnew.azurewebsites.net/api';
  private recurso = 'areas';

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

  getAllAreas(): Observable<Area[]> {
    return this.http.get<Area[]>(`${this.rutaServidor}/${this.recurso}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getAreaById(id: number): Observable<Area> {
    return this.http.get<Area>(`${this.rutaServidor}/${this.recurso}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getAreasByBusinessId(businessId: number): Observable<Area[]> {
    return this.http.get<Area[]>(`${this.rutaServidor}/${this.recurso}/business/${businessId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getAreasForUser(businessId: number): Observable<Area[]> {
    return this.http.get<Area[]>(`${this.rutaServidor}/${this.recurso}/forUser`, {
      headers: this.getAuthHeaders().set('businessId', businessId.toString()),
    });
  }

  createArea(area: Area): Observable<Area> {
    return this.http.post<Area>(`${this.rutaServidor}/${this.recurso}`, area, {
      headers: this.getAuthHeaders(),
    });
  }

  updateArea(id: number, area: Area): Observable<Area> {
    return this.http.put<Area>(`${this.rutaServidor}/${this.recurso}/${id}`, area, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteArea(id: number): Observable<void> {
    return this.http.delete<void>(`${this.rutaServidor}/${this.recurso}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
