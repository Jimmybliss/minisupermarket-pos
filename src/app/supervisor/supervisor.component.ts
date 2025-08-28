import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { InventoryService } from '../services/inventory.service';
import { InventoryManagementComponent } from '../inventory-management/inventory-management.component';
import { TransactionService } from '../services/transaction.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-supervisor',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatTableModule,
  MatButtonModule,
  InventoryManagementComponent
  ],
  templateUrl: './supervisor.component.html',
  styleUrls: ['./supervisor.component.sass']
})

export class SupervisorComponent implements OnInit, AfterViewInit {
  view: string = 'dashboard';

  // dashboard data
  lowStock: any[] = [];
  recentTransactions: any[] = [];
  recentSales: any[] = [];
  timeRange: 'today' | '7d' | '30d' | 'all' = '7d';
  isLoading = false;
  // extra views data
  salesList: any[] = [];
  cashiers: any[] = [];
  inventoryList: any[] = [];
  products: any[] = [];
  reportSummary: any = { totalSales: 0, totalTransactions: 0 };
  // chart
  @ViewChild('reportsChart') reportsChartRef!: ElementRef<HTMLCanvasElement>;
  private chartInstance: Chart | null = null;
  chartRange: '7d' | '30d' | '90d' | 'all' = '30d';

  constructor(
    private inventoryService: InventoryService,
    private transactionService: TransactionService,
  private authService: AuthService,
  public router: Router,
  private userService: UserService,
  private productService: ProductService
  ) {}

  ngOnInit(): void {
    console.debug('[SupervisorComponent] initialized, view=', this.view);
    this.loadDashboard();
  }

  ngAfterViewInit(): void {
    // initialize an empty chart; data will be pushed when reports load
    try {
      const ctx = this.reportsChartRef?.nativeElement?.getContext('2d');
      if (!ctx) return;
      this.chartInstance = new Chart(ctx, {
        type: 'line',
        data: { labels: [], datasets: [{ label: 'Sales (TZS)', data: [], borderColor: '#2b6cb0', backgroundColor: 'rgba(43,108,176,0.08)', fill: true }] },
        options: { responsive: true, maintainAspectRatio: false }
      });
    } catch (e) {
      console.error('Chart init failed', e);
    }
  }

  setView(view: string) {
    this.view = view;
    // refresh data when switching to dashboard
    if (view === 'dashboard') this.loadDashboard();
    else if (view === 'sales') this.loadSales();
    else if (view === 'cashiers') this.loadCashiers();
    else if (view === 'inventory') this.loadInventoryDetails();
    else if (view === 'reports') this.loadReports();
  }

  private loadSales(): void {
    this.isLoading = true;
    this.transactionService.getTransactions().subscribe({
      next: (tx) => {
        const arr = Array.isArray(tx) ? tx : (tx && (tx as any).results) ? (tx as any).results : [];
        this.salesList = (arr || []).filter((t: any) => {
          const type = (t.transaction_type || '').toString().toLowerCase();
          if (type.includes('sale') || type.includes('out')) return true;
          if (typeof t.amount === 'number') return t.amount < 0;
          return false;
        }).sort((a: any, b: any) => {
          const da = a.date ? new Date(a.date).getTime() : 0;
          const db = b.date ? new Date(b.date).getTime() : 0;
          return db - da;
        }).slice(0, 50);
        this.isLoading = false;
      },
      error: (err) => { console.error('Failed to load sales', err); this.isLoading = false; }
    });
  }

  private loadCashiers(): void {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        const arr = Array.isArray(users) ? users : (users && (users as any).results) ? (users as any).results : [];
        this.cashiers = (arr || []).filter((u: any) => {
          const role = ((u.role || u.groups || '') as string).toString().toLowerCase();
          return role.includes('cash') || role.includes('seller') || role.includes('sales') || !!u.is_cashier;
        });
        this.isLoading = false;
      },
      error: (err) => { console.error('Failed to load users', err); this.isLoading = false; }
    });
  }

  private loadInventoryDetails(): void {
    this.isLoading = true;
    this.inventoryService.getInventory().subscribe({
      next: (inv) => {
        const arr = Array.isArray(inv) ? inv : (inv && (inv as any).results) ? (inv as any).results : (inv && (inv as any).items) ? (inv as any).items : [];
        this.inventoryList = arr || [];
        this.isLoading = false;
      },
      error: (err) => { console.error('Failed to load inventory', err); this.isLoading = false; }
    });
  }

  loadReports(range: '7d' | '30d' | '90d' | 'all' = this.chartRange): void {
    this.isLoading = true;
    this.chartRange = range;
    this.transactionService.getTransactions().subscribe({
      next: (tx) => {
        const arr = Array.isArray(tx) ? tx : (tx && (tx as any).results) ? (tx as any).results : [];
        const totals = (arr || []).reduce((acc: any, t: any) => {
          const amt = typeof t.amount === 'number' ? t.amount : Number(t.amount) || 0;
          acc.totalTransactions += 1;
          acc.totalSales += (amt < 0 ? -amt : 0);
          return acc;
        }, { totalSales: 0, totalTransactions: 0 });
        this.reportSummary = totals;

        // prepare time series based on range
        const now = new Date();
        let start: Date | null = null;
        if (range === '7d') start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        else if (range === '30d') start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        else if (range === '90d') start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

        // group transactions by day
        const bucket: Record<string, number> = {};
        (arr || []).forEach((t: any) => {
          const d = t.date ? new Date(t.date) : null;
          if (!d) return;
          if (start && d < start) return;
          const key = d.toISOString().slice(0,10); // YYYY-MM-DD
          const amt = typeof t.amount === 'number' ? (t.amount < 0 ? -t.amount : 0) : Number(t.amount) || 0;
          bucket[key] = (bucket[key] || 0) + amt;
        });

        const labels = Object.keys(bucket).sort();
        const data = labels.map(l => bucket[l]);

        if (this.chartInstance) {
          this.chartInstance.data.labels = labels;
          (this.chartInstance.data.datasets[0].data as number[]) = data;
          this.chartInstance.update();
        }

        this.isLoading = false;
      },
      error: (err) => { console.error('Failed to load report data', err); this.isLoading = false; }
    });
  }

  // product management
  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (res) => {
        const arr = Array.isArray(res) ? res : (res && (res as any).results) ? (res as any).results : [];
        this.products = arr || [];
        this.isLoading = false;
      },
      error: (err) => { console.error('Failed to load products', err); this.isLoading = false; }
    });
  }

  deleteProduct(productId: number): void {
    if (!productId) return;
    this.productService.deleteProduct(productId).subscribe({
      next: () => { this.products = this.products.filter(p => p.id !== productId); },
      error: (err) => { console.error('Failed to delete product', err); }
    });
  }

  // inventory management (add / adjust)
  addInventory(event: Event, payload: any): void {
    event?.preventDefault?.();
    // Follow InventoryManagementComponent: require product and positive stock_quantity
    if (!payload) return;
    const productVal = payload.product || payload.product_id || payload.productId;
    const qtyRaw = payload.stock_quantity ?? payload.quantity ?? payload.qty;
    const qty = Number(qtyRaw || 0);
    if (!productVal || qty <= 0) {
      alert('Please provide product and a positive stock quantity');
      return;
    }

    const item: any = {
      product: isNaN(Number(productVal)) ? productVal : Number(productVal),
      stock_quantity: qty
    };
    if (payload.batch_number) item.batch_number = payload.batch_number;
    if (payload.expiry_date) item.expiry_date = payload.expiry_date;

    this.inventoryService.addInventory(item).subscribe({
      next: (res) => {
        // mimic reference behaviour: reset (no complex form state here) and reload
        this.loadInventoryDetails();
      },
      error: (err) => { console.error('Failed to add inventory', err); alert('Failed to add inventory item'); }
    });
  }

  adjustStock(inventoryId: number, adjustment: number): void {
    if (!inventoryId) return;
    this.inventoryService.adjustStock(inventoryId, adjustment).subscribe({
      next: () => { this.loadInventoryDetails(); },
      error: (err) => { console.error('Failed to adjust stock', err); }
    });
  }

  onLogout(): void {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']).then(() => window.location.reload());
      return;
    }

    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']).then(() => window.location.reload());
      },
      error: (err) => {
        console.error('Logout failed', err);
        this.authService.clearToken();
        this.router.navigate(['/login']).then(() => window.location.reload());
      }
    });
  }

  private loadDashboard(): void {
    this.isLoading = true;
    // fetch low stock overview
    this.inventoryService.getInventoryOverview().subscribe({
      next: (overview) => {
        this.lowStock = overview?.low_stock || [];
      },
      error: (err) => {
        console.error('Failed to load inventory overview', err);
      }
    });

    // recent transactions (we'll derive sales from transactions)
    this.transactionService.getTransactions().subscribe({
      next: (tx) => {
        this.recentTransactions = Array.isArray(tx) ? tx : [];
        this.filterSalesByTime();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load transactions', err);
        this.isLoading = false;
      }
    });
  }

  // derive sales (totals) from transactions filtered by time range
  filterSalesByTime(): void {
    const now = new Date();
    let cutoff: Date | null = null;
    if (this.timeRange === 'today') {
      cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (this.timeRange === '7d') {
      cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (this.timeRange === '30d') {
      cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const filtered = !cutoff
      ? this.recentTransactions
      : this.recentTransactions.filter(t => {
          const d = t.date ? new Date(t.date) : null;
          return d ? d >= cutoff! : false;
        });

    // aggregate sales by day (or list top N totals)
    // For simplicity, map each transaction to a sale entry with date and amount
    this.recentSales = (filtered || []).slice().sort((a,b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return db - da;
    }).map(t => ({ date: t.date, total: t.amount }));
    // limit to 5
    this.recentSales = this.recentSales.slice(0,5);
  }

  txLabel(tx: any): string {
    const type = tx?.transaction_type?.toString().toLowerCase();
    if (type) {
      if (type.includes('restock') || type.includes('purchase') || type.includes('in')) return 'Restock';
      if (type.includes('sale') || type.includes('out')) return 'Sale';
    }
    // fallback: infer by amount sign if present
    if (typeof tx?.amount === 'number') {
      return tx.amount < 0 ? 'Sale' : 'Restock';
    }
    return 'Sale';
  }
}

