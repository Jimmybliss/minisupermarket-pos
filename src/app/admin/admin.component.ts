import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatNavList } from '@angular/material/list'
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  imports: [ 
    CommonModule,
    MatSidenavModule, 
    MatNavList,
    RouterOutlet ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.sass'
})
export class AdminComponent {

}
