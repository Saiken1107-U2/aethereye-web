import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, DashboardStats, StockByCategory, MovementTrend, AlertItem, TopItem } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  stockByCategory: StockByCategory[] = [];
  movementTrend: MovementTrend[] = [];
  lowStockAlerts: AlertItem[] = [];
  topItems: TopItem[] = [];
  loading = true;
  error: string | null = null;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    // Cargar estadísticas principales
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        console.log('Estadísticas cargadas:', data);
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
        this.error = 'Error al cargar las estadísticas';
      }
    });

    // Cargar stock por categoría
    this.dashboardService.getStockByCategory().subscribe({
      next: (data) => {
        this.stockByCategory = data;
        console.log('Stock por categoría cargado:', data);
      },
      error: (error) => {
        console.error('Error al cargar stock por categoría:', error);
      }
    });

    // Cargar tendencia de movimientos (últimos 7 días)
    this.dashboardService.getMovementTrend(7).subscribe({
      next: (data) => {
        this.movementTrend = data;
        console.log('Tendencia de movimientos cargada:', data);
      },
      error: (error) => {
        console.error('Error al cargar tendencia de movimientos:', error);
      }
    });

    // Cargar alertas de stock bajo
    this.dashboardService.getLowStockAlerts().subscribe({
      next: (data) => {
        this.lowStockAlerts = data;
        console.log('Alertas de stock bajo cargadas:', data);
      },
      error: (error) => {
        console.error('Error al cargar alertas:', error);
      }
    });

    // Cargar top 5 items más usados
    this.dashboardService.getTopItems(5).subscribe({
      next: (data) => {
        this.topItems = data;
        console.log('Top items cargados:', data);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar top items:', error);
        this.loading = false;
      }
    });
  }

  refreshData(): void {
    this.loadDashboardData();
  }

  getUrgencyClass(urgencia: string): string {
    switch (urgencia) {
      case 'Crítico':
        return 'urgency-critical';
      case 'Alto':
        return 'urgency-high';
      case 'Medio':
        return 'urgency-medium';
      default:
        return 'urgency-low';
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(value);
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
}
