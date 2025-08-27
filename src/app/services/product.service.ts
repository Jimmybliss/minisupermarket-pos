import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://127.0.0.1:8000/api/products/';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Token ${this.authService.getToken()}`,
      'Content-Type': 'application/json'
    });
  }

  private getMultipartHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Token ${this.authService.getToken()}`
    });
  }

  getProducts(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  createProduct(productData: any): Observable<any> {
    return this.http.post(this.apiUrl, productData, { headers: this.getHeaders() });
  }

  updateProduct(productId: number, productData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}${productId}/`, productData, { headers: this.getHeaders() });
  }

  deleteProduct(productId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${productId}/`, { headers: this.getHeaders() });
  }

  uploadCSV(fileData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}bulk_upload/`, fileData, { 
      headers: this.getMultipartHeaders()
    });
  }
}