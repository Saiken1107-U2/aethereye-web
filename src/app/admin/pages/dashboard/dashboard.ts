import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, DashboardStats, StockByCategory, MovementTrend, AlertItem, TopItem } from '../../../core/services/dashboard.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  // Estados de carga
  loading = true;
  error: string | null = null;

  // Datos del dashboard
  stats: DashboardStats | null = null;
  stockByCategory: StockByCategory[] = [];
  movements: MovementTrend[] = [];
  alerts: AlertItem[] = [];
  topItems: TopItem[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    forkJoin({
      stats: this.dashboardService.getStats(),
      stock: this.dashboardService.getStockByCategory(),
      movements: this.dashboardService.getMovementTrend(30),
      alerts: this.dashboardService.getLowStockAlerts(),
      topItems: this.dashboardService.getTopItems(5)
    }).subscribe({
      next: (data) => {
        this.stats = data.stats;
        this.stockByCategory = data.stock;
        this.movements = data.movements;
        this.alerts = data.alerts;
        this.topItems = data.topItems;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los datos del dashboard';
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(value);
  }

  getUrgencyClass(cantidad: number): string {
    if (cantidad <= 5) return 'alert-critical';
    if (cantidad <= 10) return 'alert-warning';
    return 'alert-info';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  refresh(): void {
    this.loadDashboardData();
  }
}
