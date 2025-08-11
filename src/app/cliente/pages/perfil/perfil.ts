import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../../core/services/usuario.service';
import { AuthService } from '../../../core/services/auth.service';
import { Usuario, ActualizarPerfilRequest, CambiarPasswordRequest } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.html',
  standalone: false
})
export class PerfilComponent implements OnInit {
  form: FormGroup;
  passwordForm: FormGroup;
  cargando = true;
  exito = false;
  error = false;
  errorCarga = false;
  
  // Para cambio de contraseña
  mostrarCambioPassword = false;
  exitoPassword = false;
  errorPassword = false;
  cargandoPassword = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      id: [0],
      nombreCompleto: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      contrasenaActual: ['', Validators.required],
      contrasenaNueva: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    const usuarioActual = this.authService.obtenerUsuarioActual();
    if (usuarioActual && usuarioActual.id) {
      this.usuarioService.obtenerPerfil(usuarioActual.id).subscribe({
        next: (usuario) => {
          this.form.patchValue({
            id: usuario.id,
            nombreCompleto: usuario.nombreCompleto,
            correo: usuario.correo
          });
          this.cargando = false;
        },
        error: (err) => {
          console.error('Error al cargar perfil:', err);
          this.errorCarga = true;
          this.cargando = false;
        }
      });
    } else {
      this.errorCarga = true;
      this.cargando = false;
    }
  }

  guardar(): void {
    if (this.form.invalid) return;
    
    // Resetear mensajes de estado
    this.exito = false;
    this.error = false;
    
    const usuarioActual = this.authService.obtenerUsuarioActual();
    if (!usuarioActual) {
      this.error = true;
      return;
    }

    const request: ActualizarPerfilRequest = {
      nombreCompleto: this.form.get('nombreCompleto')?.value,
      correo: this.form.get('correo')?.value
    };
    
    this.usuarioService.actualizarPerfil(usuarioActual.id, request).subscribe({
      next: () => {
        this.exito = true;
        this.error = false;
      },
      error: (err) => {
        console.error('Error al actualizar perfil:', err);
        this.exito = false;
        this.error = true;
      }
    });
  }

  recargarPerfil(): void {
    this.cargando = true;
    this.errorCarga = false;
    this.ngOnInit();
  }

  // Métodos para cambio de contraseña
  toggleCambioPassword(): void {
    this.mostrarCambioPassword = !this.mostrarCambioPassword;
    if (!this.mostrarCambioPassword) {
      this.passwordForm.reset();
      this.exitoPassword = false;
      this.errorPassword = false;
    }
  }

  cambiarPassword(): void {
    if (this.passwordForm.invalid) return;

    this.cargandoPassword = true;
    this.exitoPassword = false;
    this.errorPassword = false;

    const usuarioActual = this.authService.obtenerUsuarioActual();
    if (!usuarioActual) {
      this.errorPassword = true;
      this.cargandoPassword = false;
      return;
    }

    const request: CambiarPasswordRequest = {
      contrasenaActual: this.passwordForm.get('contrasenaActual')?.value,
      contrasenaNueva: this.passwordForm.get('contrasenaNueva')?.value
    };

    this.usuarioService.cambiarPassword(usuarioActual.id, request).subscribe({
      next: () => {
        this.exitoPassword = true;
        this.errorPassword = false;
        this.cargandoPassword = false;
        this.passwordForm.reset();
        setTimeout(() => {
          this.mostrarCambioPassword = false;
        }, 2000);
      },
      error: (err) => {
        console.error('Error al cambiar contraseña:', err);
        this.exitoPassword = false;
        this.errorPassword = true;
        this.cargandoPassword = false;
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('contrasenaNueva');
    const confirmPassword = form.get('confirmarContrasena');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }
}
