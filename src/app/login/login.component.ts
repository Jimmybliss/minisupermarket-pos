import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.sass'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

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
          this.router.navigate(['/sales']);
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
