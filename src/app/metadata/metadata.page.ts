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
  metadataKeys: string[] = [];
  lastMatchingMetadataKeys: string[] = [];
  isSyncing: boolean = false;

  constructor(private metadataService: MetadataService, private ipfsService: IpfsService) {}

  ngOnInit(): void {
    this.metadataService.getMetadata().subscribe(
      data => {
        if (data) {
          // Metadata available
          this.metadata = data;
          this.metadataKeys = Object.keys(this.metadata);
          this.lastMatchingMetadata = data; // Update the last matching metadata
          this.lastMatchingMetadataKeys = this.metadataKeys;
          console.log('Metadata received and matched:', this.metadata);
          this.syncToPinata(this.metadata); // Start the background sync process
        } else if (this.lastMatchingMetadata) {
          // No new metadata but we have previous matching metadata
          console.log('Using last matching metadata');
          this.metadata = null; // Clear the current metadata
          this.metadataKeys = [];
          // Use the last matching metadata
        } else {
          // No matching metadata found or error occurred and no previous matching metadata
          console.warn('No matching metadata found or error occurred');
          this.metadata = null; // Set metadata to null
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
      console.error('Error syncing to Pinata:', error);
    }
    this.isSyncing = false;
  }
}
