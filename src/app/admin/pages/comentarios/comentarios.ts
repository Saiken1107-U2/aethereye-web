import { Component, OnInit } from '@angular/core';
import { 
  ComentarioAdminService, 
  ComentarioAdmin, 
  ComentarioConSeguimiento, 
  ActualizarSeguimientoRequest,
  EstadisticasSeguimiento,
  ResponderComentarioRequest 
} from '../../../core/services/comentario-admin.service';

interface ComentarioDetalle {
  id: number;
  producto: string;
  cliente: string;
  contenido: string;
  fecha: string;
  calificacion: number;
  cliente_detalle: {
    nombre: string;
    correo: string;
  };
  producto_detalle: {
    nombre: string;
    categoria: string;
  };
}

@Component({
  selector: 'app-admin-comentarios',
  templateUrl: './comentarios.html',
  standalone: false
})
export class ComentariosComponent implements OnInit {
  comentarios: ComentarioAdmin[] = [];
  comentariosConSeguimiento: ComentarioConSeguimiento[] = [];
  estadisticas: EstadisticasSeguimiento | null = null;
  mostrarModal: boolean = false;
  mostrarModalSeguimiento: boolean = false;
  mostrarModalRespuesta: boolean = false;
  comentarioDetalle: ComentarioDetalle | null = null;
  comentarioSeguimiento: ComentarioConSeguimiento | null = null;
  comentarioParaResponder: ComentarioConSeguimiento | null = null;
  vistaActual: 'basica' | 'seguimiento' = 'basica';

  // Formulario de seguimiento
  formularioSeguimiento: ActualizarSeguimientoRequest = {};

  // Formulario de respuesta
  formularioRespuesta: ResponderComentarioRequest = {
    respuestaAdmin: '',
    adminId: 1 // Por ahora hardcodeado, en producción sería del usuario actual
  };

  // Opciones para los selectores
  estadosDisponibles = ['Pendiente', 'En revision', 'Respondido', 'Resuelto', 'Archivado'];
  prioridadesDisponibles = [
    { value: 1, label: 'Alta' },
    { value: 2, label: 'Media' },
    { value: 3, label: 'Baja' }
  ];
  categoriasDisponibles = [
    'Queja', 'Sugerencia', 'Consulta', 'Problema técnico', 'Devolución', 'Elogio', 'Otro'
  ];

  constructor(private comentarioService: ComentarioAdminService) {}

  ngOnInit(): void {
    this.cargarComentarios();
    this.cargarEstadisticas();
  }

  cargarComentarios(): void {
    if (this.vistaActual === 'basica') {
      this.comentarioService.obtenerTodosLosComentarios().subscribe({
        next: (data) => {
          this.comentarios = data;
        },
        error: (error) => {
          console.error('Error al cargar comentarios:', error);
        }
      });
    } else {
      this.comentarioService.obtenerComentariosConSeguimiento().subscribe({
        next: (data) => {
          this.comentariosConSeguimiento = data;
        },
        error: (error) => {
          console.error('Error al cargar comentarios con seguimiento:', error);
        }
      });
    }
  }

  cargarEstadisticas(): void {
    this.comentarioService.obtenerEstadisticasSeguimiento().subscribe({
      next: (data) => {
        this.estadisticas = data;
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
      }
    });
  }

  cambiarVista(vista: 'basica' | 'seguimiento'): void {
    this.vistaActual = vista;
    this.cargarComentarios();
  }

  eliminar(id: number): void {
    if (confirm('¿Deseas eliminar este comentario?')) {
      this.comentarioService.eliminarComentario(id).subscribe({
        next: () => {
          this.cargarComentarios();
          this.cargarEstadisticas();
        },
        error: (error) => {
          console.error('Error al eliminar comentario:', error);
        }
      });
    }
  }

  verDetalle(comentarioId: number): void {
    const comentario = this.comentarios.find(c => c.id === comentarioId);
    if (comentario) {
      // Simular datos detallados hasta que esté disponible el endpoint
      this.comentarioDetalle = {
        id: comentario.id,
        producto: comentario.producto,
        cliente: comentario.cliente,
        contenido: comentario.contenido,
        fecha: comentario.fecha,
        calificacion: 5, // Calificación simulada
        cliente_detalle: {
          nombre: comentario.cliente || 'Cliente no especificado',
          correo: 'cliente@ejemplo.com'
        },
        producto_detalle: {
          nombre: comentario.producto,
          categoria: 'Categoría general'
        }
      };
      this.mostrarModal = true;
    }
  }

  verSeguimiento(comentario: ComentarioConSeguimiento): void {
    this.comentarioSeguimiento = comentario;
    this.formularioSeguimiento = {
      estadoSeguimiento: comentario.estadoSeguimiento,
      respuestaAdmin: comentario.respuestaAdmin || '',
      notasInternas: comentario.notasInternas || '',
      prioridad: comentario.prioridad,
      requiereAccion: comentario.requiereAccion,
      categoriaProblema: comentario.categoriaProblema || ''
    };
    this.mostrarModalSeguimiento = true;
  }

  guardarSeguimiento(): void {
    if (this.comentarioSeguimiento) {
      this.comentarioService.actualizarSeguimiento(this.comentarioSeguimiento.id, this.formularioSeguimiento).subscribe({
        next: () => {
          this.cerrarModalSeguimiento();
          this.cargarComentarios();
          this.cargarEstadisticas();
          alert('Seguimiento actualizado exitosamente');
        },
        error: (error) => {
          console.error('Error al actualizar seguimiento:', error);
          alert('Error al actualizar el seguimiento');
        }
      });
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.comentarioDetalle = null;
  }

  cerrarModalSeguimiento(): void {
    this.mostrarModalSeguimiento = false;
    this.comentarioSeguimiento = null;
    this.formularioSeguimiento = {};
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  eliminarComentario(id: number): void {
    this.eliminar(id);
    this.cerrarModal();
  }

  getPrioridadTexto(prioridad: number): string {
    switch (prioridad) {
      case 1: return 'Alta';
      case 2: return 'Media';
      case 3: return 'Baja';
      default: return 'Media';
    }
  }

  getPrioridadClase(prioridad: number): string {
    switch (prioridad) {
      case 1: return 'bg-red-100 text-red-800';
      case 2: return 'bg-yellow-100 text-yellow-800';
      case 3: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getEstadoClase(estado: string): string {
    switch (estado) {
      case 'Pendiente': return 'bg-gray-100 text-gray-800';
      case 'En revision': return 'bg-blue-100 text-blue-800';
      case 'Respondido': return 'bg-green-100 text-green-800';
      case 'Resuelto': return 'bg-purple-100 text-purple-800';
      case 'Archivado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  // Métodos para responder comentarios
  abrirModalRespuesta(comentario: ComentarioConSeguimiento): void {
    this.comentarioParaResponder = comentario;
    this.formularioRespuesta = {
      respuestaAdmin: comentario.respuestaAdmin || '',
      adminId: 1 // En producción, obtener del usuario actual
    };
    this.mostrarModalRespuesta = true;
  }

  cerrarModalRespuesta(): void {
    this.mostrarModalRespuesta = false;
    this.comentarioParaResponder = null;
    this.formularioRespuesta = {
      respuestaAdmin: '',
      adminId: 1
    };
  }

  enviarRespuesta(): void {
    if (!this.comentarioParaResponder || !this.formularioRespuesta.respuestaAdmin.trim()) {
      alert('Por favor, escriba una respuesta válida');
      return;
    }

    this.comentarioService.responderComentario(
      this.comentarioParaResponder.id, 
      this.formularioRespuesta
    ).subscribe({
      next: (response) => {
        console.log('Respuesta enviada exitosamente:', response);
        this.cerrarModalRespuesta();
        this.cargarComentarios(); // Recargar datos
        this.cargarEstadisticas(); // Actualizar estadísticas
        alert('Respuesta enviada exitosamente');
      },
      error: (error) => {
        console.error('Error al enviar respuesta:', error);
        alert('Error al enviar la respuesta');
      }
    });
  }
}
