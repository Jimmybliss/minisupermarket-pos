import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { BASE_url } from '../config';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${BASE_url}/api/users/`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ 'Authorization': `Token ${token}` });
  }

  getUsers(): Observable<any[]> {
  // prefer AuthService for token access; getHeaders() already uses AuthService
  return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  createUser(userData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, userData, { headers: this.getHeaders() });
  }

  updateUser(userId: number, userData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}${userId}/`, userData, { headers: this.getHeaders() });
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${userId}/`, { headers: this.getHeaders() });
  }

  activateUser(userId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}${userId}/activate/`, {}, { headers: this.getHeaders() });
  }
}
