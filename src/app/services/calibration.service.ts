import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Calibration } from '../models/calibration';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalibrationService {
  private rutaServidor = 'https://timecalappnew.azurewebsites.net/api';
  private recurso = 'calibrations';

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
  
  

  getAllCalibrations(): Observable<Calibration[]> {
    return this.http.get<Calibration[]>(`${this.rutaServidor}/${this.recurso}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getCalibrationById(id: number): Observable<Calibration> {
    return this.http.get<Calibration>(`${this.rutaServidor}/${this.recurso}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  createCalibration(calibrationData: Calibration): Observable<Calibration> {
    return this.http.post<Calibration>(
      `${this.rutaServidor}/${this.recurso}`,
      calibrationData,
      { headers: this.getAuthHeaders() }
    );
  }

  updateCalibration(id: number, calibrationData: Calibration): Observable<Calibration> {
    return this.http.put<Calibration>(
      `${this.rutaServidor}/${this.recurso}/${id}`,
      calibrationData,
      { headers: this.getAuthHeaders() }
    );
  }

  deleteCalibration(id: number): Observable<void> {
    return this.http.delete<void>(`${this.rutaServidor}/${this.recurso}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getCalibrationsByInstrumentId(instrumentId: number): Observable<Calibration[]> {
    return this.http.get<Calibration[]>(
      `${this.rutaServidor}/${this.recurso}/instrument/${instrumentId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  getCalibrationsByBusinessId(businessId: number): Observable<Calibration[]> {
    return this.http.get<Calibration[]>(`${this.rutaServidor}/${this.recurso}/business/${businessId}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
