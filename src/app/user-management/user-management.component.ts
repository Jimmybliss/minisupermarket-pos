import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { BASE_url } from '../config';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-user-management',
  imports: [
    MatSlideToggleModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatFormFieldModule,
    MatTableModule,
    MatSidenavModule,
    MatListModule,
    CommonModule, 
    FormsModule ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.sass'
})

export class UserManagementComponent implements OnInit {
  private BaseUrl = `${BASE_url}/api/users/`;
  users: any[] = [];
  newUser = { username: '', email: '', password: '', role: '' };
  selectedUser: any = null;
  displayedColumns: string[] = ['id', 'username', 'email', 'role', 'is_active', 'actions'];

  constructor(
    private authService: AuthService, 
    private http: HttpClient, 
    private userService: UserService,
    private dialog: MatDialog) {}

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

  toggleActive() {
    this.userService.activateUser(this.selectedUser.id).subscribe(
      (res) => {
        alert('User activated successfully');
        this.loadUsers();
        this.selectedUser = null;
      },
      (error) => {
        console.error('Error activating user', error);
      }
    );
  }

  createUser(newUser: any) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
  
    console.log('Creating user with data:', newUser); // Log the newUser data
  
    this.userService.createUser(newUser).subscribe({
      next: () => {
        console.log('User created successfully'); // Log success
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

  updateUser(updatedUser: any) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

    if (!updatedUser.id) {
      console.error('Error: updatedUser.id is undefined');
      return;
    }

    console.log('Updating user with data:', updatedUser); // Log the updatedUser data

    this.userService.updateUser(updatedUser.id, updatedUser).subscribe(
      (res) => {
        console.log('User updated successfully'); // Log success
        alert('User updated successfully');
        this.loadUsers();
        this.selectedUser = null;
      },
      (error) => {
        console.error('Error updating user', error);
      }
    );
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

  openCreateDialog() {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px',
      data: { user: { username: '', email: '', password: '', role: 'user' } }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Create dialog closed with result:', result); // Log the result
      if (result) {
        this.createUser(result);
      }
    });
  }

  openEditDialog(user: any) {
    console.log('Opening edit dialog for user:', user); // Log the user data before opening the dialog

    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px',
      data: { user: { ...user } }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Edit dialog closed with result:', result); // Log the result
      if (result) {
        this.updateUser(result);
      }
    });
  }
}
