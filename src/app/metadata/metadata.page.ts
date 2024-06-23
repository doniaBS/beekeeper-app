import { Component, OnInit } from '@angular/core';
import { MetadataService } from '../services/metadata.service';
import { IpfsService } from '../services/ipfs.service';

@Component({
  selector: 'app-metadata',
  templateUrl: './metadata.page.html',
  styleUrls: ['./metadata.page.scss'],
})
export class MetadataPage implements OnInit {
  metadata: any;
  lastMatchingMetadata: any = null;
  lastMatchingMetadataKeys: string[] = [];
  metadataKeys: string[] = [];
  isSyncing: boolean = false;

  constructor(private metadataService: MetadataService, private ipfsService: IpfsService) {}

  ngOnInit(): void {
    this.metadataService.getMetadata().subscribe(
      data => {
        if (data) {
          this.metadata = data;
          this.metadataKeys = Object.keys(this.metadata);
          this.lastMatchingMetadata = data; // Store the last matching metadata
          this.lastMatchingMetadataKeys = Object.keys(this.lastMatchingMetadata);
          console.log('Metadata received:', this.metadata);
          this.syncToPinata(this.metadata); // Start the background sync process

        } else if (this.lastMatchingMetadata) {
          console.log('Using last matching metadata');
          this.metadata = this.lastMatchingMetadata; // Use the last matching metadata
          this.metadataKeys = Object.keys(this.lastMatchingMetadata);

        } else {
          console.warn('No matching metadata found or error occurred');
          this.metadata = null; // Set metadata to null if no match or error and no last matching metadata
        }
      },
      error => console.error('Error fetching metadata:', error)
    );
  }

  async syncToPinata(metadata: any): Promise<void> {
    this.isSyncing = true;
    try {
      const result = await this.ipfsService.addDataToPinata(metadata);
      console.log('Metadata synced to Pinata:', result);
    } catch (error) {
      console.error('Error syncing metadata to Pinata:', error);
    } finally {
      this.isSyncing = false;
    }
  }
}