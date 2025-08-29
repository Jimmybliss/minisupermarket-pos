// sales.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, forkJoin,
  catchError, throwError, tap, map
 } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { BASE_url } from '../config';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  // Use same backend port as other services (8000)
  private apiUrl = `${BASE_url}/sales/`;
  private taxRate = 0.08; // 8% tax

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      console.warn('No auth token found when building headers for SalesService');
      return new HttpHeaders();
    }
    return new HttpHeaders({ 'Authorization': `Token ${token}` });
  }

  processSale(saleData: any): Observable<any> {
    const processedData = {
      ...saleData,
      tax: this.calculateTax(saleData.subtotal),
      grand_total: this.calculateGrandTotal(saleData.subtotal, saleData.discount)
    };
  return this.http.post(this.apiUrl, processedData, { headers: this.getHeaders() });
  }

  private calculateTax(subtotal: number): number {
    return subtotal * this.taxRate;
  }

  private calculateGrandTotal(subtotal: number, discount: number): number {
    const discountAmount = subtotal * (discount / 100);
    return subtotal + this.calculateTax(subtotal) - discountAmount;
  }

  getRecentSales(): Observable<any> {
  return this.http.get(`${this.apiUrl}recent/`, { headers: this.getHeaders() });
  }

  applyDiscount(saleId: number, discount: number): Observable<any> {
  return this.http.patch(`${this.apiUrl}${saleId}/apply_discount/`, { discount }, { headers: this.getHeaders() });
  }

  generateReceipt(saleId: number): Observable<any> {
  // include headers and request blob response
  return this.http.get(`${this.apiUrl}${saleId}/receipt/`, { headers: this.getHeaders(), responseType: 'blob' as 'json' });
  }

  createSale(saleData: any): Observable<any> {
  // normalize payment_method to backend choices and item field names
  const mapPaymentMethod = (method: string) => {
    if (!method) return method;
    const m = method.toString().toLowerCase();
    if (m.includes('cash')) return 'cash';
    if (m.includes('credit')) return 'credit_card';
    if (m.includes('mobile')) return 'mobile_payment';
    return method;
  };

  const salePayload = {
    customer_name: saleData.customer_name,
    payment_method: mapPaymentMethod(saleData.payment_method),
    discount: saleData.discount ?? 0,
    subtotal: saleData.subtotal,
    tax: saleData.tax,
    total: saleData.total,
    items: saleData.items.map((item: any) => ({
      // backend expects `product` field
      product: item.product_id ?? item.product,
      quantity: item.quantity,
      unit_price: item.unit_price ?? item.price ?? 0
    }))
  };

  const payloadString = JSON.stringify(salePayload);
  console.debug('Creating sale with payload string:', payloadString);

  return this.http.post(`${this.apiUrl}`, salePayload, { headers: this.getHeaders(), observe: 'response' as 'response' }).pipe(
    tap((response: any) => console.log('Sale Created (raw response):', response.status, response.headers, response.body)),
    map((response: any) => {
      // If backend returns a JSON body, return it; otherwise return a safe fallback object
      if (response && response.body) return response.body;
      const location = response?.headers?.get ? response.headers.get('Location') : null;
      return { id: location || null, total: salePayload.total };
    }),
    catchError((error: any) => {
      // Preserve original HttpErrorResponse so component can inspect status and body
      console.error('Error processing sale (rethrowing):', error);
      return throwError(() => error);
    })
  );
}
}