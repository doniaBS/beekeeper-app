import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MetadataService {
  private socket!: WebSocket;
  private metadataSubject: Subject<any> = new Subject();

  constructor() { 
    this.connect();
  }

  private connect(): void {
    this.socket = new WebSocket(`${environment.gatewayWsUrl}`);
    this.socket.onopen = () => {
      this.socket.send('Bearer valid_token');
    };

    this.socket.onmessage = (message) => {
      const data = JSON.parse(message.data);
      this.metadataSubject.next(data);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.socket.onclose = () => {
      console.warn('WebSocket connection closed. Reconnecting...');
      setTimeout(() => this.connect(), 1000);
    };
  }

  getMetadata(): Observable<any> {
    return this.metadataSubject.asObservable();
  }
}
