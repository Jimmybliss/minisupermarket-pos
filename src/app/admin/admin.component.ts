import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

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

}
