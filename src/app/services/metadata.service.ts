import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MetadataService {

  private gatewayUrl = 'http://localhost:8001/'; // URL of the gateway

  constructor(private http: HttpClient) { }

  getMetadata(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer valid_token');
    return this.http.get<any>(this.gatewayUrl);
  }
}
