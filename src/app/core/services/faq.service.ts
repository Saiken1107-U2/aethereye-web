import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Faq } from '../models/faq.model';

@Injectable({
  providedIn: 'root'
})
export class FaqService {
  private apiUrl = 'https://localhost:7052/api/FAQ';

  constructor(private http: HttpClient) {}

  obtenerFaqs(): Observable<Faq[]> {
    return this.http.get<Faq[]>(this.apiUrl);
  }
}