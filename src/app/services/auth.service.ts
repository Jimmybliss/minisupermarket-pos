// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://127.0.0.1:8000/api';  // Replace with your Django backend URL

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login/`, { username, password }).pipe(
      tap((response:any) => {
        this.setToken(response.token);
      })
    );
  }

  logout() {
    this.http.post<any>(`${this.baseUrl}/logout/`, {}).pipe(
      tap(() => {
      this.clearToken();
      })
    );
    
    console.log('Token removed from local storage')
    // Additional logout logic if needed
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  clearToken(): void {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
