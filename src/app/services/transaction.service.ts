import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { BASE_url } from '../config';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = `${BASE_url}/api/transactions/`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): { headers?: HttpHeaders } {
    const token = this.authService.getToken();
    if (token) {
      return { headers: new HttpHeaders({ Authorization: `Token ${token}` }) };
    }
    return {};
  }

  getTransactions(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHeaders()).pipe(
      catchError(err => {
        console.error('Error loading transactions', err);
        return throwError(() => err);
      })
    );
  }
}
