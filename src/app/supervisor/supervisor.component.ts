import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';


@Component({
  selector: 'app-supervisor',
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule

  ],
  templateUrl: './supervisor.component.html',
  styleUrls: ['./supervisor.component.css']
})
export class SupervisorComponent {
  view: string = 'dashboard';

  setView(view: string) {
    this.view = view;
  }
}
