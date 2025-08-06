import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = this.authService.obtenerToken();

    // Decodificar el token (simplificado, en producción usa jwt-decode)
    const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;

    if (payload && payload.rol === 'Administrador') {
      return true;
    } else {
      this.router.navigate(['/auth']);
      return false;
    }
  }
}
