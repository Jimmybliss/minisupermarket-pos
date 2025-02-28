import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-product-management',
  imports: [ 
    MatTableModule,
    CommonModule, 
    FormsModule,
    MatIconModule,
    MatSlideToggle
   ],
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.sass']
})
export class ProductManagementComponent implements OnInit {
  products: any[] = [];
  csvFile: File | null = null;
  displayedColumns: string[] = ['id', 'name', 'category', 'description', 'price', 'barcode', 'is_active', 'actions', 'created_at', 'updated_at'];

  constructor(
    private productService: ProductService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
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
    this.productService.createProduct(newProduct).subscribe(() => {
      this.loadProducts();
    });
  }

  updateProduct(updatedProduct: any) {
    this.productService.updateProduct(updatedProduct.id, updatedProduct).subscribe(() => {
      this.loadProducts();
    });
  }

  deleteProduct(productId: number) {
    this.productService.deleteProduct(productId).subscribe(() => {
      this.loadProducts();
    });
  }

  toggleActive(productId: number) {
    const product = this.products.find(p => p.id === productId);
    if (product) {
      this.productService.updateProduct(productId, { is_active: !product.is_active }).subscribe(() => {
        this.loadProducts();
      });
    }
  }

  uploadCSV(event: any) {
    this.csvFile = event.target.files[0];
  }
  
  submitCSV() {
    if (this.csvFile) {
      const formData = new FormData();
      formData.append('file', this.csvFile);
  
      this.productService.uploadCSV(formData).subscribe(() => {
        this.csvFile = null;
        this.loadProducts(); // Refresh products after upload
      });
    }
  }
}
