import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-cliente-layout',
  templateUrl: './cliente-layout.html',
  standalone: false
})
export class ClienteLayoutComponent {
  constructor(private authService: AuthService, private router: Router) {}

  cerrarSesion() {
    this.authService.cerrarSesion();
    this.router.navigate(['/auth']);
  }
}