import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatList, MatNavList } from '@angular/material/list';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-salesperson',
  imports: [
    MatSidenavModule,
    MatNavList,
    MatListModule,
    MatIconModule,
    RouterModule,
    MatDividerModule

  ],
  templateUrl: './salesperson.component.html',
  styleUrl: './salesperson.component.sass'
})
export class SalespersonComponent {

  constructor(private router: Router, private authService: AuthService) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
