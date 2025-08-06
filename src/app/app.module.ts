import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CotizacionModule } from './public/pages/cotizacion/cotizacion.module';

import { AppRoutingModule } from './app-routing.module';
import { App } from './app';
import { ClienteModule } from './cliente/cliente-module';
import { PublicModule } from './public/public-module';
import { CoreModule } from './core/core-module';

// Importar interceptor
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

@NgModule({
  declarations: [
    App
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    CoreModule,
    ClienteModule,
    PublicModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [App]
})
export class AppModule { }