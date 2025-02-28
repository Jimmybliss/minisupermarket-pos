import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://127.0.0.1:8000/api/categories/';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  createCategory(categoryData: any): Observable<any> {
    return this.http.post(this.apiUrl, categoryData);
  }

  updateCategory(categoryId: number, categoryData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}${categoryId}/`, categoryData);
  }

  deleteCategory(categoryId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${categoryId}/`);
  }
}
