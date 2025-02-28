import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../services/category.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@Component({
  selector: 'app-category-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatLabel,
    ReactiveFormsModule,
  
  ],
  templateUrl: './category-dialog.component.html',
  styleUrl: './category-dialog.component.sass'
})
export class CategoryDialogComponent {
  categoryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.categoryForm = this.fb.group({
      id: [data.category ? data.category.id : null],
      name: [data.category ? data.category.name : '', Validators.required]
    });
  }

  save() {
    if (this.categoryForm.valid) {
      if (this.categoryForm.value.id) {
        this.categoryService.updateCategory(this.categoryForm.value.id, this.categoryForm.value).subscribe(() => {
          this.dialogRef.close(true);
        });
      } else {
        this.categoryService.createCategory(this.categoryForm.value).subscribe(() => {
          this.dialogRef.close(true);
        });
      }
    }
  }

  close() {
    this.dialogRef.close();
  }
}
