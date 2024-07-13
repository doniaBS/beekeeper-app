import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as crypto from 'crypto-js';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import { IpfsService } from '../services/ipfs.service';

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
  private provider: MetaMaskEthereumProvider | null = null;
  public loggedInAccount: string | null = null;
  private lastMatchingMetadata: any = null;

  constructor(private router: Router, private ipfsService: IpfsService) {
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

        // Process metadata and interact with the smart contract
        const beekeeperId = metadata.beekeeper_id;
        console.log(beekeeperId);
        try {
          const beekeeperAddress = await this.getBeekeeperAddress(beekeeperId);
          console.log(`Beekeeper Address: ${beekeeperAddress}`);

          // Upload metadata to Pinata and get IPFS hash
          const ipfsHash = await this.ipfsService.addDataToPinata(metadata);
          console.log(`Metadata synced to Pinata: ${ipfsHash}`);

          // Convert IPFS hash to string
          const ipfsHashString = ipfsHash.toString();

          // Send IPFS hash to smart contract
          const txHash = await this.sendHashToContract(ipfsHashString);
          console.log(`IPFS Hash stored in smart contract. Transaction hash: ${txHash}`);

          // Check if the beekeeperAddress matches the loggedInAccount
          if (beekeeperAddress && this.loggedInAccount && beekeeperAddress.toLowerCase() === this.loggedInAccount.toLowerCase()) {
            this.lastMatchingMetadata = metadata; // Store the matching metadata
            this.metadataSubject.next(this.lastMatchingMetadata);
          } else {
            console.warn('Beekeeper address does not match the logged-in account');
            // Do not emit the new metadata if addresses do not match
            this.metadataSubject.next(null);
          }

        } catch (error) {
          console.error('Error retrieving beekeeper address:', error);
          // Do not emit the new metadata if an error occurs
          this.metadataSubject.next(null);
        }

      } else {
        console.error('Hashes do not match. Authentication failed.');
        // Do not emit the new metadata if authentication fails
        this.metadataSubject.next(null);
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

  // Function to send IPFS hash to the smart contract
  private async sendHashToContract(ipfsHash: string): Promise<string> {
    const accounts = await this.web3.eth.getAccounts();
    try {
      const result = await this.contract.methods.storeIpfsHash(ipfsHash).send({ from: accounts[0], gas: 5000000 });
      return result.transactionHash;
    } catch (error) {
      console.error('Error sending IPFS hash to smart contract:', error);
      throw error;
    }
  }
}
