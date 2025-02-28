import { Component, Inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatLabel } from '@angular/material/form-field';




@Component({
  selector: 'app-user-dialog',
  standalone: true,
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
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.sass'
})
export class UserDialogComponent {
  userForm: FormGroup;



  constructor(
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {

    this.userForm = this.fb.group({
      username: [data.user.username],
      email: [data.user.email],
      password: [data.user.password],
      role: [data.user.role]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    console.log('Saving user with data: ', this.userForm.value);
    this.dialogRef.close(this.userForm.value);
  }

}
