import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  standalone: false
})
export class DashboardComponent implements OnInit {
  totales = {
    usuarios: 0,
    productos: 0,
    ventas: 0,
    comentarios: 0
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.obtenerTotales().subscribe({
      next: (data) => this.totales = data,
      error: (err) => console.error('Error al cargar totales', err)
    });
  }
}
