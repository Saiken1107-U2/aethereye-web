import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DashboardService } from '../../../core/services/dashboard.service';

interface CotizacionPorEstado {
  estado: string;
  cantidad: number;
}

interface Actividad {
  descripcion: string;
  fecha: Date;
  tipo: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  standalone: false
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('ventasChart', { static: false }) ventasChart!: ElementRef<HTMLCanvasElement>;

  totales = {
    usuarios: 0,
    productos: 0,
    ventas: 0,
    comentarios: 0
  };

  cotizacionesPorEstado: CotizacionPorEstado[] = [];
  ultimasActividades: Actividad[] = [];
  ventasPorMes: number[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.crearGraficoVentas();
    }, 100);
  }

  cargarDatos(): void {
    // Cargar totales
    this.dashboardService.obtenerTotales().subscribe({
      next: (data) => this.totales = data,
      error: (err) => console.error('Error al cargar totales', err)
    });

    // Cargar cotizaciones por estado
    this.cargarCotizacionesPorEstado();
    
    // Cargar últimas actividades
    this.cargarUltimasActividades();
    
    // Cargar datos de ventas para el gráfico
    this.cargarVentasPorMes();
  }

  cargarCotizacionesPorEstado(): void {
    // Simulación de datos - reemplazar con servicio real
    this.cotizacionesPorEstado = [
      { estado: 'Pendiente', cantidad: 15 },
      { estado: 'Aprobada', cantidad: 8 },
      { estado: 'Rechazada', cantidad: 3 }
    ];
  }

  cargarUltimasActividades(): void {
    // Simulación de datos - reemplazar con servicio real
    this.ultimasActividades = [
      {
        descripcion: 'Nueva cotización recibida de Juan Pérez',
        fecha: new Date(),
        tipo: 'Cotización'
      },
      {
        descripcion: 'Usuario María García registrado',
        fecha: new Date(Date.now() - 3600000),
        tipo: 'Usuario'
      },
      {
        descripcion: 'Venta completada - Producto AetherEye Pro',
        fecha: new Date(Date.now() - 7200000),
        tipo: 'Venta'
      },
      {
        descripcion: 'Nuevo comentario en producto',
        fecha: new Date(Date.now() - 10800000),
        tipo: 'Comentario'
      }
    ];
  }

  cargarVentasPorMes(): void {
    // Simulación de datos - reemplazar con servicio real
    this.ventasPorMes = [12, 15, 8, 20, 25, 18, 22, 28, 16, 30, 24, 20];
  }

  crearGraficoVentas(): void {
    if (!this.ventasChart) return;

    const canvas = this.ventasChart.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const maxValue = Math.max(...this.ventasPorMes);
    const barWidth = canvas.width / this.ventasPorMes.length;
    const barMaxHeight = canvas.height - 40;

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar barras
    this.ventasPorMes.forEach((ventas, index) => {
      const barHeight = (ventas / maxValue) * barMaxHeight;
      const x = index * barWidth + 10;
      const y = canvas.height - barHeight - 20;

      // Barra
      ctx.fillStyle = '#3B82F6';
      ctx.fillRect(x, y, barWidth - 20, barHeight);

      // Etiqueta del mes
      ctx.fillStyle = '#374151';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(meses[index], x + (barWidth - 20) / 2, canvas.height - 5);

      // Valor
      ctx.fillText(ventas.toString(), x + (barWidth - 20) / 2, y - 5);
    });
  }

  getColorByStatus(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'bg-yellow-500';
      case 'aprobada':
        return 'bg-green-500';
      case 'rechazada':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  }

  getTotalCotizaciones(): number {
    return this.cotizacionesPorEstado.reduce((total, item) => total + item.cantidad, 0);
  }

  getActivityColor(tipo: string): string {
    switch (tipo.toLowerCase()) {
      case 'cotización':
        return 'bg-blue-100 text-blue-800';
      case 'usuario':
        return 'bg-green-100 text-green-800';
      case 'venta':
        return 'bg-yellow-100 text-yellow-800';
      case 'comentario':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
