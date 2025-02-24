import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-user-management',
  imports: [ CommonModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.sass'
})


export class UserManagementComponent implements OnInit {
  users: any[] = [];

  constructor(
    private authService: AuthService, 
    private http: HttpClient, 
    private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    
    this.http.get<any[]>('http://127.0.0.1:8000/api/users/', { headers }).subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error fetching users', error);
      }
    );
  }

  deactivateUser(userId: number) {
    this.userService.updateUser(userId, { is_active: false }).subscribe(() => {
      this.loadUsers();
    });
  }
}

