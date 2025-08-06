import { Component, OnInit } from '@angular/core';
import { FaqService } from '../../../core/services/faq.service';
import { Faq } from '../../../core/models/faq.model';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  standalone: false
})
export class FaqComponent implements OnInit {
  faqs: Faq[] = [];
  abierto: number | null = null;

  constructor(private faqService: FaqService) {}

  ngOnInit(): void {
    // Datos de ejemplo mientras se configura el servicio
    this.faqs = [
      {
        id: 1,
        pregunta: "¿Qué es AetherEye?",
        respuesta: "AetherEye es una plataforma integral para la gestión de productos y servicios, ofreciendo soluciones innovadoras para empresas de todos los tamaños."
      },
      {
        id: 2,
        pregunta: "¿Cómo puedo solicitar una cotización?",
        respuesta: "Puedes solicitar una cotización navegando a la sección 'Cotización' en nuestro menú principal, donde encontrarás un formulario detallado para enviar tu solicitud."
      },
      {
        id: 3,
        pregunta: "¿Cuáles son los métodos de pago disponibles?",
        respuesta: "Aceptamos diversos métodos de pago incluyendo transferencias bancarias, tarjetas de crédito/débito, y pagos en efectivo para entregas locales."
      },
      {
        id: 4,
        pregunta: "¿Ofrecen soporte técnico?",
        respuesta: "Sí, ofrecemos soporte técnico 24/7 a través de múltiples canales: email, teléfono, y chat en línea. Nuestro equipo está disponible para resolver cualquier duda o problema."
      },
      {
        id: 5,
        pregunta: "¿Cuáles son los tiempos de entrega?",
        respuesta: "Los tiempos de entrega varían según el producto y la ubicación. Generalmente, manejamos entregas de 3-5 días hábiles para productos en stock y 7-15 días para productos personalizados."
      },
      {
        id: 6,
        pregunta: "¿Tienen garantía los productos?",
        respuesta: "Todos nuestros productos incluyen garantía. La duración varía según el tipo de producto, desde 1 año para productos estándar hasta 3 años para equipos especializados."
      },
      {
        id: 7,
        pregunta: "¿Cómo puedo crear una cuenta?",
        respuesta: "Para crear una cuenta, haz clic en 'Iniciar Sesión' y luego en 'Registrarse'. Completa el formulario con tus datos y recibirás un email de confirmación."
      },
      {
        id: 8,
        pregunta: "¿Realizan envíos internacionales?",
        respuesta: "Actualmente nuestros servicios están enfocados en el mercado nacional, pero estamos evaluando opciones para envíos internacionales. Contáctanos para casos específicos."
      }
    ];

    // Comentado temporalmente hasta configurar el servicio
    // this.faqService.obtenerFaqs().subscribe(data => {
    //   this.faqs = data;
    // });
  }

  toggle(id: number): void {
    this.abierto = this.abierto === id ? null : id;
  }
}
