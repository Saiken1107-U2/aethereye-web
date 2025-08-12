import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    const expectedRoles = route.data['roles'] as Array<string>;
    
    console.log('🛡️ RoleGuard verificando roles:', { expectedRoles, currentUrl: state.url });
    
    if (!this.authService.isAuthenticated()) {
      console.log('❌ Usuario no autenticado, redirigiendo a login');
      this.router.navigate(['/auth/login']);
      return false;
    }

    const usuario = this.authService.obtenerUsuarioActual();
    console.log('👤 Usuario actual:', usuario);
    
    if (!usuario) {
      console.log('❌ No se pudo obtener usuario, redirigiendo a login');
      this.router.navigate(['/auth/login']);
      return false;
    }
    
    if (!expectedRoles.includes(usuario.rol)) {
      console.log('❌ Rol no autorizado:', { rolUsuario: usuario.rol, rolesEsperados: expectedRoles });
      
      // Redirigir según el rol del usuario sin cerrar sesión
      if (usuario.rol === 'Administrador' || usuario.rol === 'Admin') {
        console.log('🔄 Redirigiendo administrador a /admin');
        this.router.navigate(['/admin']);
      } else if (usuario.rol === 'Cliente') {
        console.log('🔄 Redirigiendo cliente a /cliente');
        this.router.navigate(['/cliente']);
      } else {
        console.log('🔄 Rol no reconocido, redirigiendo a /public');
        this.router.navigate(['/public']);
      }
      return false;
    }

    console.log('✅ Acceso autorizado');
    return true;
  }
}
