import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../../core/services/usuario.service';
import { AuthService } from '../../../core/services/auth.service';
import { Usuario, ActualizarPerfilRequest } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.html',
  standalone: false
})
export class PerfilComponent implements OnInit {
  form: FormGroup;
  cargando = true;
  exito = false;
  error = false;
  errorCarga = false;

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
}
