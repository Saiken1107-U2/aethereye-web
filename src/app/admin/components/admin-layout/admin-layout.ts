import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';


@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.html',
  standalone: false
})
export class AdminLayoutComponent {
  constructor(private authService: AuthService, private router: Router) {}

  cerrarSesion() {
    this.authService.cerrarSesion();
    this.router.navigate(['/auth']);
  }
}
