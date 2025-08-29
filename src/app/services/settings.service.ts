import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_url } from '../config';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private apiUrl = `${BASE_url}/settings/`;

  constructor(private http: HttpClient) {}

  getSettings(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  updateSettings(settings: any): Observable<any> {
    return this.http.put(`${this.apiUrl}1/`, settings);
  }

  resetSettings(): Observable<any> {
    return this.http.post(`${this.apiUrl}reset/`, {});
  }
}
