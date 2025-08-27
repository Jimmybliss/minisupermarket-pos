import { Component, OnInit, OnDestroy } from '@angular/core';
import { TransactionService } from '../services/transaction.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-transactions',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
  MatTableModule,
  MatInputModule,
  MatButtonModule
  ],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.sass']
})
export class TransactionsComponent implements OnInit, OnDestroy {
  transactions: any[] = [];
  isLoading = false;
  error: string | null = null;
  private subs: Subscription | null = null;
  displayedColumns: string[] = ['date', 'product', 'transaction_type', 'amount'];

  constructor(private transactionService: TransactionService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
      this.subs = null;
    }
  }

  loadTransactions(): void {
    this.isLoading = true;
    this.error = null;
    this.subs = this.transactionService.getTransactions().subscribe({
      next: data => {
        this.transactions = data;
        this.isLoading = false;
      },
      error: err => {
        console.error('Transactions load failed', err);
        this.error = err?.message || 'Failed to load transactions';
        this.transactions = [];
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.transactions = this.transactions.filter(t =>
      t.product.name.toLowerCase().includes(filterValue.toLowerCase())
    );
  }

  exportCSV(): void {
    console.log("Exporting transactions as CSV...");
    // TODO: Implement CSV export logic
  }

  exportPDF(): void {
    console.log("Exporting transactions as PDF...");
    // TODO: Implement PDF export logic
  }
}
