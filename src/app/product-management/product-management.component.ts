import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-product-management',
  imports: [ 
    MatTableModule,
    CommonModule, 
    FormsModule,
    MatIconModule,
    MatSlideToggle,
    MatSnackBarModule,
    MatProgressSpinnerModule
   ],
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.sass']
})
export class ProductManagementComponent implements OnInit {
  products: any[] = [];
  csvFile: File | null = null;
  displayedColumns: string[] = ['id', 'name', 'category', 'description', 'price', 'barcode', 'is_active', 'actions', 'created_at', 'updated_at'];
  loading: boolean = false;

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: data => {
        this.products = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Failed to load products', 'Close', { duration: 3000 });
      }
    });
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '400px',
      data: { product: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createProduct(result);
      }
    });
  }

  openEditDialog(product: any) {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '400px',
      data: { product }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateProduct(result);
      }
    });
  }

  createProduct(newProduct: any) {
    this.loading = true;
    this.productService.createProduct(newProduct).subscribe({
      next: () => {
        this.snackBar.open('Product created successfully', 'Close', { duration: 2000 });
        this.loadProducts();
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Failed to create product', 'Close', { duration: 3000 });
      }
    });
  }

  updateProduct(updatedProduct: any) {
    this.loading = true;
    this.productService.updateProduct(updatedProduct.id, updatedProduct).subscribe({
      next: () => {
        this.snackBar.open('Product updated', 'Close', { duration: 2000 });
        this.loadProducts();
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Failed to update product', 'Close', { duration: 3000 });
      }
    });
  }

  deleteProduct(productId: number) {
    this.loading = true;
    this.productService.deleteProduct(productId).subscribe({
      next: () => {
        this.snackBar.open('Product deleted', 'Close', { duration: 2000 });
        this.loadProducts();
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Failed to delete product', 'Close', { duration: 3000 });
      }
    });
  }

  toggleActive(productId: number) {
    const product = this.products.find(p => p.id === productId);
    if (product) {
      this.loading = true;
      this.productService.updateProduct(productId, { is_active: !product.is_active }).subscribe({
        next: () => {
          this.snackBar.open('Product status updated', 'Close', { duration: 2000 });
          this.loadProducts();
        },
        error: () => {
          this.loading = false;
          this.snackBar.open('Failed to update status', 'Close', { duration: 3000 });
        }
      });
    }
  }

  uploadCSV(event: any) {
    this.csvFile = event.target.files[0];
  }
  
  submitCSV() {
    if (this.csvFile) {
      this.loading = true;
      const formData = new FormData();
      formData.append('file', this.csvFile);

      this.productService.uploadCSV(formData).subscribe({
        next: () => {
          this.snackBar.open('CSV uploaded successfully', 'Close', { duration: 2000 });
          this.csvFile = null;
          this.loadProducts();
        },
        error: () => {
          this.loading = false;
          this.snackBar.open('CSV upload failed', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
