import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Instrument } from '../models/instruments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InstrumentService {
  private rutaServidor = 'https://timecalappnew.azurewebsites.net/api';
  private recurso = 'instruments';

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
  
  

  getAllInstruments(): Observable<Instrument[]> {
    return this.http.get<Instrument[]>(`${this.rutaServidor}/${this.recurso}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getInstrumentById(id: number): Observable<{ data: Instrument }> {
    return this.http.get<{ data: Instrument }>(
      `${this.rutaServidor}/${this.recurso}/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  getInstrumentsByAreaId(areaId: number): Observable<Instrument[]> {
    return this.http.get<Instrument[]>(
      `${this.rutaServidor}/${this.recurso}/area/${areaId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  getInstrumentsByBusinessId(businessId: number): Observable<Instrument[]> {
    return this.http.get<Instrument[]>(
      `${this.rutaServidor}/${this.recurso}/business/${businessId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  createInstrument(
    instrumentData: Instrument,
    areaId: number,
    imageFile?: File
  ): Observable<Instrument> {
    const formData = new FormData();
    formData.append('data', JSON.stringify(instrumentData));
    formData.append('areaId', areaId.toString());
    if (imageFile) {
      formData.append('image', imageFile);
    }
    return this.http.post<Instrument>(
      `${this.rutaServidor}/instruments`,
      formData,
      { headers: this.getAuthHeaders() }
    );
  }

  updateInstrument(
    id: number,
    instrumentData: Instrument,
    areaId: number,
    imageFile?: File
  ): Observable<Instrument> {
    const formData = new FormData();
    formData.append('data', JSON.stringify(instrumentData));
    formData.append('areaId', areaId.toString());
    if (imageFile) {
      formData.append('image', imageFile);
    }
    return this.http.put<Instrument>(
      `${this.rutaServidor}/instruments/${id}`,
      formData,
      { headers: this.getAuthHeaders() }
    );
  }

  deleteInstrument(id: number): Observable<void> {
    return this.http.delete<void>(`${this.rutaServidor}/${this.recurso}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}

