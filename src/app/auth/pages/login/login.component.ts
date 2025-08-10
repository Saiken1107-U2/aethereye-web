import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  standalone: false
})
export class LoginComponent {
  form: FormGroup;
  error = false;
  errorMessage = '';
  loading = false;
  returnUrl = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Obtener URL de retorno si existe
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
  }

  login(): void {
    if (this.form.invalid) {
      this.markFormGroupTouched();
      return;
    }

    // Prevenir múltiples envíos
    if (this.loading) {
      return;
    }

    this.loading = true;
    this.error = false;
    this.errorMessage = '';

    const { correo, contrasena } = this.form.value;

    this.authService.login(correo, contrasena).subscribe({
      next: (response) => {
        console.log('🎉 Login exitoso, respuesta:', response);
        this.loading = false;
        
        // El AuthService ya maneja el guardado del token y usuario
        const usuario = response.usuario;
        console.log('👤 Usuario logueado:', usuario);
        console.log('🔐 Rol del usuario:', usuario.rol);

        // Redirigir según el rol del usuario
        if (this.returnUrl) {
          console.log('🔄 Redirigiendo a returnUrl:', this.returnUrl);
          this.router.navigateByUrl(this.returnUrl);
        } else {
          if (usuario.rol === 'Admin') {
            console.log('👑 Redirigiendo a /admin');
            this.router.navigate(['/admin']);
          } else if (usuario.rol === 'Cliente') {
            console.log('🙋‍♂️ Redirigiendo a /cliente');
            this.router.navigate(['/cliente']);
          } else {
            console.log('🌐 Rol no reconocido, redirigiendo a /public. Rol:', usuario.rol);
            this.router.navigate(['/public']);
          }
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = true;
        
        // Manejo simple de errores
        if (err.status === 401) {
          this.errorMessage = 'Credenciales incorrectas. Por favor verifica tu email y contraseña.';
        } else if (err.status === 500) {
          this.errorMessage = 'Error del servidor. Por favor intenta más tarde.';
        } else if (err.status === 0) {
          this.errorMessage = 'No se puede conectar al servidor. Verifica tu conexión a internet.';
        } else {
          this.errorMessage = err.error?.message || 'Ha ocurrido un error inesperado.';
        }
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();
    });
  }

  // Getters para facilitar el acceso a los controles en el template
  get correo() { return this.form.get('correo'); }
  get contrasena() { return this.form.get('contrasena'); }

  // Métodos para validaciones en el template
  hasError(field: string, error: string): boolean {
    const control = this.form.get(field);
    return !!(control?.hasError(error) && control?.touched);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }
}
