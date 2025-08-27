import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { SalesService } from '../services/sales.service';
import { AuthService } from '../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';

interface SaleData {
  customer_name: string;
  payment_method: string;
  discount: number;
  subtotal: number;
  tax: number;
  total: number;
  items: {
    product_id: string; // Ensuring correct field name
    quantity: number;
    unit_price: number;
  }[];
}

interface SaleResponse {
  id: string;
  total: number;
}

@Component({
  selector: 'app-sales',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatListModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    MatAutocompleteModule,
    MatTableModule,
    CommonModule
  ],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.sass']
})
export class SalesComponent implements OnInit {
  saleForm: FormGroup;
  products: any[] = [];
  filteredProducts: { [index: number]: any[] } = {};
  paymentMethods = ['Cash', 'Credit Card', 'Mobile Payment'];
  isLoading = false;
  searching = false;
  showProductList: boolean[] = [];
  selectedProducts: any[] = [];
  initialRows = 8; // number of empty rows to show in the table by default
  // numpad / touchscreen helpers
  activeField: { index: number; field: 'quantity' | 'price' } | null = null;

  get items(): FormArray {
    return this.saleForm.get('items') as FormArray;
  }

  get subtotal(): number {
    return this.items.controls.reduce((total, item) => total + (item.get('subtotal')?.value || 0), 0);
  }

  get tax(): number {
    return this.subtotal * 0.0; // 8% tax rate
  }

  get discountAmount(): number {
    return (this.subtotal * (this.saleForm.get('discount')?.value || 0)) / 100;
  }

  get grandTotal(): number {
    return this.subtotal + this.tax - this.discountAmount;
  }

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private salesService: SalesService,
    private authService: AuthService
  ) {
    this.saleForm = this.fb.group({
      customer_name: [''],
      payment_method: ['Cash', Validators.required],
      discount: [0, [Validators.min(0), Validators.max(100)]],
      items: this.fb.array([this.createItem()])
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.setupFormListeners();
    this.ensureInitialRows(this.initialRows);
  }

  private ensureInitialRows(count: number): void {
    // ensure the form array has at least `count` rows for touchscreen data entry
    while (this.items.length < count) {
      this.addItem();
    }
  }

  private setupFormListeners(): void {
    this.saleForm.get('discount')?.valueChanges.subscribe(() => {
      this.updateAllSubtotals();
    });
  }

  private loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = {};
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load products', err);
        this.isLoading = false;
      }
    });
  }

  createItem(): FormGroup {
    return this.fb.group({
      product_search: [''], // <- ensure template bindings to product_search work
      product_id: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      subtotal: [0]
    });
  }

  addItem(): void {
    this.items.push(this.createItem());
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  onProductSearch(event: Event, index: number): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredProducts[index] = searchTerm.length >= 2
      ? this.products.filter(product =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.barcode.includes(searchTerm)
        )
      : [];
  }

  onBarcodeEnter(event: Event, index: number): void {
    // prevent Enter from submitting the surrounding form
    if (event && typeof (event as any).preventDefault === 'function') {
      (event as any).preventDefault();
      (event as any).stopPropagation();
    }
    const value = ((event.target as HTMLInputElement) || (event.currentTarget as HTMLInputElement))?.value?.trim();
    if (!value) return;
    // try exact barcode match first
    const byBarcode = this.products.find(p => p.barcode === value || String(p.barcode) === value);
    if (byBarcode) {
  // ensure search input shows the chosen product name for feedback
  this.items.at(index).get('product_search')?.patchValue(byBarcode.name);
  this.onProductSelect(byBarcode, index);
      return;
    }
    // fallback: if typed name >= 2 chars, try fuzzy find by name
    const found = this.products.find(p => p.name.toLowerCase().includes(value.toLowerCase()));
    if (found) {
      this.onProductSelect(found, index);
      return;
    }
    // if nothing found, keep suggestions open for manual selection
    this.onProductSearch(event as any, index);
  }

  onProductSelect(product: any, index: number): void {
    const itemGroup = this.items.at(index);
    itemGroup.patchValue({
      product_id: product.id,
      price: product.price,
      subtotal: product.price * itemGroup.value.quantity
    });

    this.selectedProducts[index] = product;
    this.filteredProducts[index] = [];

  // show chosen product name in search input for feedback
  itemGroup.get('product_search')?.patchValue(product.name);

    if (index === this.items.length - 1) {
      this.addItem();
    }
    // after selecting product focus quantity for touchscreen
    this.setActiveField(index, 'quantity');
  }

  setActiveField(index: number, field: 'quantity' | 'price'): void {
    this.activeField = { index, field };
    // if user interacts with the last row, append a new empty row for touch entry
    if (index === this.items.length - 1) {
      this.addItem();
    }
  }

  appendNumpad(value: string): void {
    if (!this.activeField) return;
    const ctrl = this.items.at(this.activeField.index).get(this.activeField.field as string as any);
    if (!ctrl) return;
    const cur = ctrl.value != null ? String(ctrl.value) : '';
    // prevent multiple leading zeros
    let next = cur === '0' && value !== '.' ? value : cur + value;
    // allow single decimal point
    if (value === '.' && cur.includes('.')) return;
    if (this.activeField.field === 'quantity') {
      // quantity should be integer
      next = next.replace(/[^0-9]/g, '');
      const num = next === '' ? 0 : parseInt(next, 10);
      ctrl.patchValue(num);
    } else {
      // price allow decimals
      next = next.replace(/[^0-9.]/g, '');
      const num = next === '' ? 0 : parseFloat(next);
      ctrl.patchValue(num);
    }
    this.updateSubtotal(this.activeField.index);
  }

  backspaceActive(): void {
    if (!this.activeField) return;
    const ctrl = this.items.at(this.activeField.index).get(this.activeField.field as string as any);
    if (!ctrl) return;
    const cur = ctrl.value != null ? String(ctrl.value) : '';
    const next = cur.slice(0, -1);
    if (this.activeField.field === 'quantity') {
      const num = next === '' ? 0 : parseInt(next, 10);
      ctrl.patchValue(isNaN(num) ? 0 : num);
    } else {
      const num = next === '' ? 0 : parseFloat(next);
      ctrl.patchValue(isNaN(num) ? 0 : num);
    }
    this.updateSubtotal(this.activeField.index);
  }

  clearActive(): void {
    if (!this.activeField) return;
    const ctrl = this.items.at(this.activeField.index).get(this.activeField.field as string as any);
    if (!ctrl) return;
    ctrl.patchValue(0);
    this.updateSubtotal(this.activeField.index);
  }

  getActiveValue(): string {
    if (!this.activeField) return '—';
    const ctrl = this.items.at(this.activeField.index).get(this.activeField.field as string as any);
    if (!ctrl) return '—';
    return String(ctrl.value ?? '');
  }

  updateSubtotal(index: number): void {
    const itemGroup = this.items.at(index);
    const quantity = itemGroup.get('quantity')?.value;
    const price = itemGroup.get('price')?.value;

    if (quantity && price) {
      itemGroup.patchValue({ subtotal: quantity * price });
    }
  }

  private updateAllSubtotals(): void {
    this.items.controls.forEach((item, index) => this.updateSubtotal(index));
  }

  submitSale(): void {
    if (this.saleForm.invalid) {
      console.warn('Form is invalid:', this.saleForm.errors);
      this.markFormGroupTouched(this.saleForm);
      return;
    }

    const payload = this.prepareSalePayload();
    if (!payload) {
      alert('Please add at least one product before submitting the sale.');
      return;
    }

    if (this.isLoading) {
      return; // prevent duplicate submissions
    }

    this.isLoading = true;
    this.salesService.createSale(payload).subscribe({
      next: (response: SaleResponse) => {
        this.isLoading = false;
        this.handleSuccessfulSale(response);
      },
      error: (err: any) => {
        this.isLoading = false;
  // log full error for debugging
  console.dir(err);
  const serverBody = err?.error;
  const serverMessage = (serverBody && (serverBody.message || serverBody.detail || JSON.stringify(serverBody))) || err?.message || 'Failed to complete sale transaction';
  console.error('Sale failed:', err);
  alert(`Sale failed: ${serverMessage}`);
      }
    });
  }

  private prepareSalePayload(): SaleData | null {
    // filter out any empty/placeholder items (no product_id)
    const validItems = (this.saleForm.value.items || [])
      .filter((it: any) => it && it.product_id && +it.quantity > 0)
      .map((it: any) => ({
        product_id: it.product_id,
        quantity: +it.quantity,
        unit_price: +it.price
      }));

    if (!validItems.length) return null;

    const payload: SaleData = {
      customer_name: this.saleForm.value.customer_name || '',
      payment_method: this.saleForm.value.payment_method,
      discount: this.saleForm.value.discount || 0,
      subtotal: this.subtotal,
      tax: this.tax,
      total: this.grandTotal,
      items: validItems
    };

    return payload;
  }

  private handleSuccessfulSale(response: SaleResponse): void {
    // reset form safely
    this.saleForm.reset({ payment_method: 'Cash', discount: 0 });
    this.items.clear();
    this.addItem();
    // reset UI helpers
    this.selectedProducts = [];
    this.filteredProducts = {};
    //alert(`Sale ${response.id} completed successfully!\nTotal: ${response.total}`);
  }

  private markFormGroupTouched(formGroup: AbstractControl): void {
    if (formGroup instanceof FormGroup) {
      Object.keys(formGroup.controls).forEach(key => {
        const control = formGroup.controls[key];
        control.markAsTouched();
        this.markFormGroupTouched(control);
      });
    } else if (formGroup instanceof FormArray) {
      formGroup.controls.forEach(control => {
        control.markAsTouched();
        this.markFormGroupTouched(control);
      });
    } else {
      // FormControl
      formGroup.markAsTouched();
    }
  }
}
