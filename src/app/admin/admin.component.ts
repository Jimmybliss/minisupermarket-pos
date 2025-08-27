import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  imports: [ 
    CommonModule,
    MatSidenavModule, 
    MatListModule,
    MatButtonModule,
    RouterOutlet ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.sass'
})
export class AdminComponent {

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ){ }

  onLogout(): void {
    this.http.post('http://127.0.0.1:8000/api/logout/', {}).subscribe({
      next: () => {
        localStorage.removeItem('auth_token'); // Remove token
        this.router.navigate(['/login']).then(() => {
          window.location.reload(); // Ensure fresh navigation
        });
      },
      error: (err) => console.error('Logout failed', err)
    });
  }

}
