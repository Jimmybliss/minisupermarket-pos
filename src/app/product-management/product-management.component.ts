import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-management',
  imports: [ CommonModule, FormsModule ],
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.sass'
})
export class ProductManagementComponent {
  products: any[] = [];
  productData = {
    name: '',
    price: '',
    barcode: '',
    
  };

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
    });
  }

  createProduct() {
    this.productService.createProduct(this.productData).subscribe(() => {
      this.loadProducts();
    });
  }

  updateProduct(productId: number) {
    this.productService.updateProduct(productId, this.productData).subscribe(() => {
      this.loadProducts();
    });
  }

  deleteProduct(productId: number) {
    this.productService.deleteProduct(productId).subscribe(() => {
      this.loadProducts();
    });
  }

}
