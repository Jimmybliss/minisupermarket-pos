import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-management',
  imports: [ CommonModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.sass'
})
export class UserManagementComponent {
users: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe(data => {
      this.users = data;
    });
  }

  deactivateUser(userId: number) {
    this.userService.updateUser(userId, { is_active: false }).subscribe(() => {
      this.loadUsers();
    });
  }
}

