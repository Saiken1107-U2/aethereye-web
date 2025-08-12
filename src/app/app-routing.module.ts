import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: 'public',
    loadChildren: () => import('./public/public-module').then(m => m.PublicModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin-module').then(m => m.AdminModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin', 'Administrador'] }
  },
  {
    path: 'cliente',
    loadChildren: () => import('./cliente/cliente-module').then(m => m.ClienteModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Cliente'] }
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'public'
  },
  {
    path: '**',
    redirectTo: 'public'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }