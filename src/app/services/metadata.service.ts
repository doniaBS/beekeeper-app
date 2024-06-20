import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as crypto from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class MetadataService {
  private socket!: WebSocket;
  private metadataSubject: Subject<any> = new Subject();
  private sharedSecret: string = 'dOnIaLIPAH24Techoney';

  constructor() { 
    this.connect();
  }

  private generateNonce(length: number = 16): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  private calculateHash(sharedSecret: string, nonce: string, timestamp: string): string {
    const data = `${nonce}${timestamp}${sharedSecret}`;
    return crypto.SHA256(data).toString(crypto.enc.Hex);
  }

  private connect(): void {
    this.socket = new WebSocket(`${environment.gatewayWsUrl}`);

    this.socket.onopen = () => {
      this.socket.send('Bearer valid_token');
    };

    this.socket.onmessage = (message) => {
      const data = JSON.parse(message.data);

      // Extract nonce, timestamp, and hash
      const nonce = data.nonce;
      const timestamp = data.timestamp;
      const receivedHash = data.hash;
      const metadata = data.metadata;

      // Calculate hash
      const calculatedHash = this.calculateHash(this.sharedSecret, nonce, timestamp);

      if (calculatedHash === receivedHash) {
        console.log('Hashes match. Authentication successful.');
        this.metadataSubject.next(metadata);
      } else {
        console.error('Hashes do not match. Authentication failed.');
      }
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
