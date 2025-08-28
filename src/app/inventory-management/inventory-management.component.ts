import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InventoryService } from '../services/inventory.service';
import { ProductService } from '../services/product.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

interface NewInventoryItem {
  product: number | { id: number; name?: string };
  batch_number?: string;
  stock_quantity: number;
  expiry_date?: string;
}

@Component({
  selector: 'app-inventory-management',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatAutocompleteModule,
  MatDatepickerModule,
  MatNativeDateModule
  ],
  templateUrl: './inventory-management.component.html',
  styleUrls: ['./inventory-management.component.sass']
})
export class InventoryManagementComponent implements OnInit {
  inventory: any[] = [];
  inventoryOverview: any[] = [];
  displayedColumns: string[] = ['product', 'batch_number', 'stock_quantity', 'expiry_date', 'actions'];
  newItem: NewInventoryItem = { product: 0, batch_number: '', stock_quantity: 0, expiry_date: '' };
  lowStockThreshold = 5; // below this is low stock
  mediumStockThreshold = 20; // between low and medium

  products: any[] = [];
  filteredProducts: any[] = [];
  newProductName = '';
  // sorting state
  sortField: string | null = null;
  sortAsc: boolean = true;

  constructor(
    private inventoryService: InventoryService,
    private productService: ProductService
  , private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadInventory();
  this.loadProducts();
  }

  private loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data || [];
        this.filteredProducts = [];
        // if a product query param is present, preselect it
        const pid = this.route.snapshot.queryParamMap.get('product');
        if (pid) {
          const match = this.products.find(p => String(p.id) === String(pid));
          if (match) {
            this.selectProduct(match);
          }
        }
      },
      error: (err) => {
        console.error('Failed to load products for autocomplete', err);
      }
    });
  }

  filterProducts(term: string): void {
    const q = (term || '').toLowerCase();
    this.filteredProducts = q.length >= 1
      ? this.products.filter(p => (p.name || '').toLowerCase().includes(q) || String(p.id) === q)
      : [];
  }

  selectProduct(p: any): void {
    if (!p) return;
    this.newItem.product = p.id;
    this.newProductName = p.name;
    this.filteredProducts = [];
  }

  loadInventory(): void {
    this.inventoryService.getInventory().subscribe({
      next: (data) => {
        console.log('Inventory data:', data);  // Debugging
        this.inventory = data;
      },
      error: (err) => {
        console.error('Error loading inventory:', err);
      }
    });
  }

  addInventoryItem(): void {
    if (!this.newItem || !this.newItem.product || this.newItem.stock_quantity <= 0) {
      alert('Please provide product and a positive stock quantity');
      return;
    }

    this.inventoryService.addInventory(this.newItem).subscribe({
      next: (res) => {
        this.newItem = { product: 0, batch_number: '', stock_quantity: 0, expiry_date: '' };
        this.loadInventory();
      },
      error: (err) => {
        console.error('Failed to add inventory', err);
        alert('Failed to add inventory item');
      }
    });
  }

  rowClass(item: any): string {
    if (this.isExpired(item.expiry_date)) return 'expired-row';
    if (item.stock_quantity <= 0) return 'depleted-row';
    if (item.stock_quantity <= this.lowStockThreshold) return 'low-row';
    if (item.stock_quantity <= this.mediumStockThreshold) return 'medium-row';
    return 'healthy-row';
  }
  

  getInventoryOverview(): void {
    this.inventoryService.getInventoryOverview().subscribe(data => {
      this.inventoryOverview = data;
    });
  }

  adjustStock(inventoryId: number, amount: number): void {
    this.inventoryService.adjustStock(inventoryId, amount).subscribe(() => {
      this.loadInventory();
    });
  }

  sortBy(field: string): void {
    if (this.sortField === field) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortField = field;
      this.sortAsc = true;
    }
  console.debug('sortBy', { field: this.sortField, asc: this.sortAsc });
  this.doSort();
  }

  sortIndicator(field: string): string {
    if (this.sortField !== field) return '⇅';
    return this.sortAsc ? '↑' : '↓';
  }

  private doSort(): void {
    if (!this.sortField) return;
    const field = this.sortField;
    this.inventory.sort((a: any, b: any) => {
      const va = a[field];
      const vb = b[field];
      // date handling
      if (field === 'expiry_date') {
        const da = va ? new Date(va).getTime() : 0;
        const db = vb ? new Date(vb).getTime() : 0;
        return this.sortAsc ? da - db : db - da;
      }
      // numeric
      if (typeof va === 'number' && typeof vb === 'number') {
        return this.sortAsc ? va - vb : vb - va;
      }
      // string fallback
      const sa = (va || '').toString().toLowerCase();
      const sb = (vb || '').toString().toLowerCase();
      if (sa < sb) return this.sortAsc ? -1 : 1;
      if (sa > sb) return this.sortAsc ? 1 : -1;
      return 0;
    });
  // Reassign array reference so Angular/Material table notices the change
  this.inventory = [...this.inventory];
  console.debug('doSort finished', { field: this.sortField, asc: this.sortAsc });
  }

  isExpired(expiryDate: string): boolean {
    return new Date(expiryDate) < new Date();
  }
}
