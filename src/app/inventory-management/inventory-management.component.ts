import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../services/inventory.service';
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
    MatButtonModule
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

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.loadInventory();
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

  isExpired(expiryDate: string): boolean {
    return new Date(expiryDate) < new Date();
  }
}
