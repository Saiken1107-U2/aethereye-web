import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioAdminService } from '../../../core/services/usuario-admin.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.html',
  standalone: false
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  roles: any[] = [];
  form: FormGroup;
  modoEditar = false;
  usuarioActual: any | null = null;

  constructor(
    private usuarioService: UsuarioAdminService, 
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      id: [0],
      nombreCompleto: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required],
      rolId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Verificar permisos de administrador
    console.log('🔍 Verificando permisos...');
    console.log('👤 Usuario actual:', this.authService.obtenerUsuarioActual());
    console.log('👑 ¿Es admin?:', this.authService.isAdmin());
    console.log('🔑 Token:', this.authService.obtenerToken());
    
    if (!this.authService.isAdmin()) {
      console.error('❌ Usuario no tiene permisos de administrador');
      alert('No tienes permisos para acceder a esta sección');
      return;
    }
    
    this.cargarUsuarios();
    this.cargarRoles();
  }

  cargarUsuarios(): void {
    this.usuarioService.obtenerUsuarios().subscribe(data => {
      this.usuarios = data;
    });
  }

  cargarRoles(): void {
    this.usuarioService.obtenerRoles().subscribe(data => {
      this.roles = data;
    });
  }

  guardar(): void {
    console.log('💾 Intentando guardar usuario...');
    console.log('📝 Formulario válido:', this.form.valid);
    console.log('📋 Datos del formulario:', this.form.value);
    console.log('👑 Permisos de admin:', this.authService.isAdmin());
    
    if (this.form.invalid) {
      console.error('❌ Formulario inválido');
      return;
    }

    if (!this.authService.isAdmin()) {
      console.error('❌ Sin permisos de administrador');
      alert('No tienes permisos para realizar esta acción');
      return;
    }

    const usuario = this.form.value;
    console.log('👤 Usuario a enviar:', usuario);

    if (this.modoEditar) {
      // Remover la contraseña si está vacía al editar
      if (!usuario.contrasena) {
        delete usuario.contrasena;
      }
      
      console.log('✏️ Actualizando usuario...');
      this.usuarioService.actualizarUsuario(usuario).subscribe({
        next: (response) => {
          console.log('✅ Usuario actualizado:', response);
          this.cargarUsuarios();
          this.resetForm();
        },
        error: (error) => {
          console.error('❌ Error al actualizar:', error);
        }
      });
    } else {
      console.log('➕ Creando nuevo usuario...');
      this.usuarioService.crearUsuario(usuario).subscribe({
        next: (response) => {
          console.log('✅ Usuario creado:', response);
          this.cargarUsuarios();
          this.resetForm();
        },
        error: (error) => {
          console.error('❌ Error al crear:', error);
        }
      });
    }
  }

  editar(usuario: any): void {
    this.form.patchValue({
      id: usuario.id,
      nombreCompleto: usuario.nombreCompleto,
      correo: usuario.correo,
      rolId: usuario.rol.id,
      contrasena: '' // Dejar vacío al editar
    });
    
    // Hacer la contraseña opcional al editar
    this.form.get('contrasena')?.clearValidators();
    this.form.get('contrasena')?.updateValueAndValidity();
    
    this.modoEditar = true;
    this.usuarioActual = usuario;
  }

  eliminar(id: number): void {
    if (confirm('¿Deseas eliminar este usuario?')) {
      this.usuarioService.eliminarUsuario(id).subscribe(() => {
        this.cargarUsuarios();
      });
    }
  }

  cambiarEstado(usuario: any): void {
    const nuevoEstado = !usuario.estaActivo;
    const accion = nuevoEstado ? 'activar' : 'desactivar';
    
    if (confirm(`¿Deseas ${accion} este usuario?`)) {
      this.usuarioService.cambiarEstadoUsuario(usuario.id, nuevoEstado).subscribe(() => {
        this.cargarUsuarios();
      });
    }
  }

  resetForm(): void {
    this.form.reset({ 
      id: 0,
      nombreCompleto: '',
      correo: '',
      contrasena: '',
      rolId: ''
    });
    
    // Restaurar validador de contraseña
    this.form.get('contrasena')?.setValidators(Validators.required);
    this.form.get('contrasena')?.updateValueAndValidity();
    
    this.modoEditar = false;
    this.usuarioActual = null;
  }
}
