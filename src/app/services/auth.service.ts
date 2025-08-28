// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { response } from 'express';
import { BASE_url } from '../config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${BASE_url}/api`;  // centralized base url

  constructor(private http: HttpClient) { }

  private authHeaders(): { headers: HttpHeaders } {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Token ${token}` } : {}),
    });
    return { headers };
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login/`, { username, password }).pipe(
      tap((response:any) => {
        this.setToken(response.token);
      })
    );
  }

  logout(): Observable<any> {
    // send token in header so DRF can authenticate the request
    return this.http.post<any>(`${this.baseUrl}/logout/`, {}, this.authHeaders()).pipe(
      tap(() => this.clearToken())
    );
    
    console.log('Token removed from local storage')
    // Additional logout logic if needed
  }

  setToken(token: string): void {
  localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
  return localStorage.getItem('auth_token');
  }

  clearToken(): void {
  localStorage.removeItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
