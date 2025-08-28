import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.sass']
})
export class AdminComponent {

  constructor(
    private auth: AuthService,
    private http: HttpClient,
    private router: Router
  ) { }

  onLogout(): void {
    const token = this.auth.getToken();
    if (!token) {
      // not logged in client-side, just navigate
      this.router.navigate(['/login']).then(() => window.location.reload());
      return;
    }

    this.auth.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']).then(() => window.location.reload());
      },
      error: (err) => {
        // if unauthorized or other failure, still clear local state and redirect
        console.error('Logout error', err);
        this.auth.clearToken();
        this.router.navigate(['/login']).then(() => window.location.reload());
      }
    });
  }

}
