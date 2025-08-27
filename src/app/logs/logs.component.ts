import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchLogs();
  }

  fetchLogs() {
    this.http.get<any[]>('http://127.0.0.1:8000/api/activity_logs/').subscribe(data => {
      this.logs = data;
      this.filteredLogs = data;
    });
  }

  applyFilter() {
    this.filteredLogs = this.logs.filter(log =>
      (!this.selectedAction || log.action === this.selectedAction) &&
      (!this.selectedUser || log.user?.toLowerCase().includes(this.selectedUser.toLowerCase()))
    );
  }

  exportLogs() {
    window.open('http://127.0.0.1:8000/api/activity_logs/export_csv/', '_blank');
  }

  clearLogs() {
    this.http.delete('http://127.0.0.1:8000/api/activity_logs/clear_logs/?days=30').subscribe(() => {
      this.fetchLogs();
    });
  }
}
