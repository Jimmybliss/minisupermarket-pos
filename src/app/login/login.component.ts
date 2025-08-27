import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule, 
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService, 
    private router: Router,
  ) { }

  onLogin(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: (res) => {
        // Save token to local storage
        this.authService.setToken(res.token);
    
        // Extract role correctly from the response
        const role = res.role;  // No need to access `res.User.role`
    
        // Navigate based on user role
        if (role === 'Admin') {
          this.router.navigate(['/admin']);
        } else if (role === 'Supervisor') {
          this.router.navigate(['/supervisor']);
        } else {
          this.router.navigate(['/salesperson']);
        }
      },
      error: (err) => {
        this.errorMessage = 'Invalid credentials, please try again';
      },
      complete: () => {
        console.log('Login request completed.');
      }
    });
  }
}
