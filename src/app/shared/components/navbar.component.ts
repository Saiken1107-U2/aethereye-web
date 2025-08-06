import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService, Usuario } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  template: `
    <nav class="bg-blue-600 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-xl font-bold">AetherEye</h1>
        
        @if (isAuthenticated) {
          <div class="flex items-center space-x-4">
            <span>Bienvenido, {{ currentUser?.nombreCompleto }}</span>
            <span class="bg-blue-500 px-2 py-1 rounded text-sm">{{ currentUser?.rol }}</span>
            <button 
              (click)="logout()" 
              class="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition">
              Cerrar Sesión
            </button>
          </div>
        } @else {
          <div class="space-x-2">
            <a href="/auth/login" class="bg-blue-500 hover:bg-blue-700 px-3 py-1 rounded transition">
              Iniciar Sesión
            </a>
            <a href="/auth/register" class="bg-green-500 hover:bg-green-700 px-3 py-1 rounded transition">
              Registrarse
            </a>
          </div>
        }
      </div>
    </nav>
  `,
  standalone: false
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: Usuario | null = null;
  isAuthenticated = false;
  private subscriptions: Subscription[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Suscribirse al estado de autenticación
    this.subscriptions.push(
      this.authService.isAuthenticated$.subscribe(isAuth => {
        this.isAuthenticated = isAuth;
      })
    );

    // Suscribirse al usuario actual
    this.subscriptions.push(
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
      })
    );
  }

  ngOnDestroy(): void {
    // Limpiar suscripciones para evitar memory leaks
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  logout(): void {
    this.authService.cerrarSesion();
  }

  // Métodos para verificar roles específicos
  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isCliente(): boolean {
    return this.authService.isCliente();
  }
}
