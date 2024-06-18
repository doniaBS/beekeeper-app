import { Component, OnInit } from '@angular/core';
import { MetadataService } from '../services/metadata.service';

@Component({
  selector: 'app-metadata',
  templateUrl: './metadata.page.html',
  styleUrls: ['./metadata.page.scss'],
})
export class MetadataPage implements OnInit {
  metadata: any;
  syncing: boolean = false;

  constructor(private metadataService: MetadataService) {}

  ngOnInit() {
    this.getMetadata();
  }

  getMetadata() {
    this.metadataService.getMetadata().subscribe(
      (data) => {
        // Check if data is not null or undefined
        if (data) {
          this.metadata = data;
          console.log('Metadata received:', this.metadata);
        } else {
          console.error('Received metadata is null or undefined');
        }
      },
      (error) => {
        console.error('Error fetching metadata', error);
      }
    );
  }

  //async syncMetadata() {
    //this.syncing = true;
    //try {
      //const response = await this.metadataService.getMetadata().toPromise();

      //const ipfsHash = response.data.IpfsHash;
      //console.log('IPFS Hash:', ipfsHash);

      // Logic to store hash on the blockchain via MetaMask
      // Ensure you have connected MetaMask and have the web3 instance ready

      // Example of sending transaction:
      // await this.web3.eth.sendTransaction({ from: this.account, to: 'blockchain_contract_address', data: this.web3.utils.toHex(ipfsHash) });

      //this.syncing = false;
      //console.log('Metadata synced to blockchain');
    //} catch (error) {
      //this.syncing = false;
      //console.error('Error syncing metadata', error);
    //}
  //}
}