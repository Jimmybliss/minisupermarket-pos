import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BASE_url } from '../config';

@Component({
  selector: 'app-logs',
  imports: [
    MatFormFieldModule,
    MatTableModule,
    CommonModule,
    FormsModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {
  logs: any[] = [];
  filteredLogs: any[] = [];
  selectedAction = '';
  selectedUser = '';
  actionTypes = ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'];

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchLogs();
  }

  private getAuthHeaders(): HttpHeaders {
    let token: string | null = null;
    try {
      token = this.authService && typeof this.authService.getToken === 'function'
        ? this.authService.getToken()
        : null;
    } catch (e) {
      token = null;
    }
    // fallback to localStorage if AuthService is not available for some reason
    if (!token) {
      try { token = localStorage.getItem('auth_token') || localStorage.getItem('token'); } catch (e) { token = null; }
    }
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Token ${token}`);
    }
    return headers;
  }

  fetchLogs() {
    const headers = this.getAuthHeaders();
  this.http.get<any[]>(`${BASE_url}/activity_logs/`, { headers }).subscribe({
      next: (data) => {
        this.logs = data;
        this.filteredLogs = data;
      },
      error: (err) => {
        console.error('Failed to fetch logs', err);
        this.logs = [];
        this.filteredLogs = [];
      }
    });
  }

  applyFilter() {
    this.filteredLogs = this.logs.filter(log =>
      (!this.selectedAction || log.action === this.selectedAction) &&
      (!this.selectedUser || log.user?.toLowerCase().includes(this.selectedUser.toLowerCase()))
    );
  }

  exportLogs() {
    const headers = this.getAuthHeaders();
  const url = `${BASE_url}/activity_logs/export_csv/`;
    // Fetch CSV as blob with auth header, then open in new tab
    this.http.get(url, { headers, responseType: 'blob' }).subscribe({
      next: (blob) => {
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
      },
      error: (err) => {
        console.error('Failed to export logs', err);
        alert('Failed to export logs');
      }
    });
  }

  clearLogs() {
    const headers = this.getAuthHeaders();
  const url = `${BASE_url}/activity_logs/clear_logs/?days=30`;
  this.http.delete(url, { headers }).subscribe({
      next: () => this.fetchLogs(),
      error: (err) => {
        console.error('Failed to clear logs', err);
        alert('Failed to clear logs');
      }
    });
  }
}
