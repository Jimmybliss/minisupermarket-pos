import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  imports: [ CommonModule, FormsModule ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.sass'
})

export class UserManagementComponent implements OnInit {
  private BaseUrl = 'http://127.0.0.1:8000/api/users/';
  users: any[] = [];
  newUser = { username: '', email: '', password: '', role: '' };
  selectedUser: any = null;

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
    
    this.http.get<any[]>(this.BaseUrl, { headers }).subscribe(
      (data) => {
        this.users = data.sort((a, b) => a.id - b.id);
      },
      (error) => {
        console.error('Error fetching users', error);
      }
    );
  }

  deactivateUser(userId: number) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

    this.userService.updateUser(userId, { is_active: false }).subscribe(() => {
      this.loadUsers();
    });
  }

  activateUser(userId: number) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

    this.userService.updateUser(userId, { is_active: true }).subscribe(() => {
      this.loadUsers();
    });
  }

  createUser() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
  
    // Debugging: Log newUser data
    console.log('Creating user with data:', this.newUser);
  
    this.userService.createUser(this.newUser).subscribe({ //http.post<any>(this.BaseUrl, this.newUser, { headers }).subscribe({
      next: () => {
        this.newUser = { username: '', email: '', password: '', role: 'user' };
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error creating user:', error);
        alert('User creation failed: ' + JSON.stringify(error.error));
      }
    });
  }
  

  selectUser(user: any) {
    this.selectedUser = { ...user };
  }

  updateUser() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

    if (this.selectedUser) {
      this.userService.updateUser(this.selectedUser.id, this.selectedUser).subscribe(
        (res) => {
          alert('User updated successfully');
          this.loadUsers();
          this.selectedUser = null;
        },
        (error) => {
          console.error('Error updating user', error);
        }
      );
    }
  }

  deleteUser(userId: number): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe(
        (res) => {
          alert('User deleted successfully');
          this.loadUsers();
        },
        (error) => {
          console.error('Error deleting user', error);
        }
      );
    }
  }
}
