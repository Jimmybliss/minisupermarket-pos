import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';


@Injectable({
    providedIn: 'root'
  })
  export class ProductService {
    private apiUrl = 'http://127.0.0.1:8000/api/products/';
    private baseUrl = 'http://127.0.0.1:8000/api/';
  
    constructor(
      private http: HttpClient,
      private authService: AuthService

    ) { }

    private getHeaders(): HttpHeaders {
      const token = this.authService.getToken();
      return new HttpHeaders({ 'Authorization': `Token ${token}` });

    }
  
    getProducts(): Observable<any> {
      return this.http.get(this.apiUrl);
    }
  
    createProduct(productData: any): Observable<any> {
      return this.http.post(this.apiUrl, productData);
    }
  
    updateProduct(productId: number, productData: any): Observable<any> {
      return this.http.put(`${this.apiUrl}${productId}/`, productData);
    }
  
    deleteProduct(productId: number): Observable<any> {
      return this.http.delete(`${this.apiUrl}${productId}/`);
    }

    uploadCSV(fileData: FormData): Observable<any> {
      return this.http.post(`${this.apiUrl}bulk_upload/`, fileData);
    }
  }
  