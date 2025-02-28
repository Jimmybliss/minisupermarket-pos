import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-dialog',
  imports: [
    MatLabel,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.sass']
})
export class ProductDialogComponent {
  productForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.productForm = this.fb.group({
      id: [data.product ? data.product.id : null],
      name: [data.product ? data.product.name : '', Validators.required],
      category: [data.product ? data.product.category : '', Validators.required],
      description: [data.product ? data.product.description : ''],
      price: [data.product ? data.product.price : 0, [Validators.required, Validators.min(0)]],
      barcode: [data.product ? data.product.barcode : '']
    });
  }

  save() {
    if (this.productForm.valid) {
      this.dialogRef.close(this.productForm.value);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
