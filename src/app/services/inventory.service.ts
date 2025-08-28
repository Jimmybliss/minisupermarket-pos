import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { BASE_url } from '../config';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = `${BASE_url}/api/inventory/`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      console.warn('InventoryService: no auth token found');
      return new HttpHeaders();
    }
    return new HttpHeaders({ 'Authorization': `Token ${token}` });
  }

  getInventory(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Inventory API error:', error);
        return throwError(error);
      })
    );
  }
  

  adjustStock(inventoryId: number, adjustment: number): Observable<any> {
    return this.http.post(`${this.apiUrl}${inventoryId}/adjust_stock/`, { adjustment }, { headers: this.getHeaders() });
  }

  getInventoryOverview(): Observable<any> {
    return this.http.get(`${this.apiUrl}overview/`, { headers: this.getHeaders() });
  }

  addInventory(item: any): Observable<any> {
    // expected item shape: { product: id or object, batch_number, stock_quantity, expiry_date }
    return this.http.post(this.apiUrl, item, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Error adding inventory:', error);
        return throwError(error);
      })
    );
  }
}
