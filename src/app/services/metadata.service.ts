import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as crypto from 'crypto-js';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';

type MetaMaskEthereumProvider = {
  isMetaMask?: boolean;
  request?: (args: { method: string; params?: any[] }) => Promise<any>;
};

@Injectable({
  providedIn: 'root'
})
export class MetadataService {
  private socket!: WebSocket;
  private metadataSubject: Subject<any> = new Subject();
  private sharedSecret: string = 'dOnIaLIPAH24Techoney';
  private web3: Web3;
  private contract: any;
  private beekeeperAddress: string | null = null;
  private provider: MetaMaskEthereumProvider | null = null;
  private loggedInAccount: string | null = null;

  constructor(private router: Router) { 
    this.web3 = new Web3(Web3.givenProvider || 'http://localhost:7545'); // Connect to Ganache
    this.contract = new this.web3.eth.Contract(environment.contractABI, environment.contractAddress);
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

    this.socket.onmessage = async (message) => {
      const data = JSON.parse(message.data);
      console.log(data);

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

        // Process metadata and interact with the smart contract
        const beekeeperId = metadata.beekeeper_id;
        console.log(beekeeperId)
        try {
        const beekeeperAddress = await this.getBeekeeperAddress(beekeeperId);
        console.log(`Beekeeper Address: ${beekeeperAddress}`);

        // Check if the beekeeperAddress matches the loggedInAccount
          if (beekeeperAddress.toLowerCase() === this.loggedInAccount?.toLowerCase()) {
            this.metadataSubject.next(metadata);
          } else {
            console.warn('Beekeeper address does not match the logged-in account');
            this.metadataSubject.next(null); // Emit null or empty data to indicate no match
          }

      } catch (error) {
        console.error('Error retrieving beekeeper address:', error);
        this.metadataSubject.next(null); // Emit null or empty data to indicate error
      }

      } else {
        console.error('Hashes do not match. Authentication failed.');
        this.metadataSubject.next(null); // Emit null or empty data to indicate error
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

  // Function to get the beekeeper address from the smart contract
  private async getBeekeeperAddress(beekeeperId: number): Promise<string> {
    const accounts = await this.web3.eth.getAccounts();
    console.log(`Calling getBeekeeperAddress with beekeeperId: ${beekeeperId}`);
    console.log(`Using account: ${accounts[0]}`);
    try {
      const beekeeperAddress = await this.contract.methods.getBeekeeperAddress(beekeeperId).call({ from: accounts[0] });
      return beekeeperAddress;
    } catch (error) {
      console.error('Smart contract call failed:', error);
      throw error;
    }
  }

  // Function to log in with MetaMask
  async loginWithMetaMask(): Promise<void> {
    this.provider = (await detectEthereumProvider()) as MetaMaskEthereumProvider;
    if (this.provider) {
      this.web3 = new Web3(this.provider as any);
      try {
        await this.provider.request!({ method: 'eth_requestAccounts' });
        const accounts = await this.web3.eth.getAccounts();
        this.loggedInAccount = accounts[0];
        console.log('Connected account:', this.loggedInAccount);
        this.router.navigate(['/metadata']);
      } catch (error) {
        console.error('User denied account access', error);
      }
    } else {
      console.error('Please install MetaMask!');
    }
  }
}
