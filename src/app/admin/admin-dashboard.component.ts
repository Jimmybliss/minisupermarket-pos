import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../services/user.service';
import { ProductService } from '../services/product.service';
import { InventoryService } from '../services/inventory.service';
import { TransactionService } from '../services/transaction.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.sass']
})
export class AdminDashboardComponent implements OnInit {
  totalUsers: number | null = null;
  totalProducts: number | null = null;
  lowStockCount: number | null = null;
  isLoading = true;

  constructor(
    private userService: UserService,
    private productService: ProductService,
    private inventoryService: InventoryService,
    private txService: TransactionService
  ) {}

  ngOnInit(): void {
    this.loadCounts();
  }

  private loadCounts(): void {
    this.isLoading = true;

    const users$ = this.userService.getUsers().pipe(catchError(err => {
      console.error('Failed to load users', err);
      return of([]);
    }));

    const products$ = this.productService.getProducts().pipe(catchError(err => {
      console.error('Failed to load products', err);
      return of([]);
    }));

    const overview$ = this.inventoryService.getInventoryOverview().pipe(catchError(err => {
      console.error('Failed to load inventory overview', err);
      return of({ low_stock: [] });
    }));

    forkJoin([users$, products$, overview$]).subscribe({
      next: (results: any[]) => {
        const [users, products, overview] = results;
        // normalize user count
        if (Array.isArray(users)) {
          this.totalUsers = users.length;
        } else if (users && typeof (users as any).count === 'number') {
          this.totalUsers = (users as any).count;
        } else {
          this.totalUsers = 0;
        }

        // normalize product count
        if (Array.isArray(products)) {
          this.totalProducts = products.length;
        } else if (products && typeof (products as any).count === 'number') {
          this.totalProducts = (products as any).count;
        } else {
          this.totalProducts = 0;
        }

        // inventory overview low_stock handling
        if (overview && Array.isArray((overview as any).low_stock)) {
          this.lowStockCount = overview.low_stock.length;
        } else if (overview && typeof (overview as any).low_stock_count === 'number') {
          this.lowStockCount = (overview as any).low_stock_count;
        } else {
          this.lowStockCount = 0;
        }
      },
      error: (err) => {
        console.error('Error loading dashboard counts', err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

}
