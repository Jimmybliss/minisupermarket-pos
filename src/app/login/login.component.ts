import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  providers: [AuthService],
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
    this.authService.login(this.username, this.password).subscribe(
      res => {
        // Save token to local storage
        this.authService.setToken(res.token);
        // Navigate to the dashboard based on user role
        const role = res.user.role;
        if (role === 'Admin') {
          this.router.navigate(['/admin']);
        } else if (role === 'Supervisor') {
          this.router.navigate(['/supervisor']);
        } else {
          this.router.navigate(['/user']);
        }
      },
      err => {
        this.errorMessage = 'invalid credentials, please try again';
      }
    );
  }
}
