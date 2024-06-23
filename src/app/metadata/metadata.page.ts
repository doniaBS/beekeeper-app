import { Component, OnInit } from '@angular/core';
import { MetadataService } from '../services/metadata.service';

@Component({
  selector: 'app-metadata',
  templateUrl: './metadata.page.html',
  styleUrls: ['./metadata.page.scss'],
})
export class MetadataPage implements OnInit {
  metadata: any;
  lastMatchingMetadata: any = null;

  constructor(private metadataService: MetadataService) {}

  ngOnInit(): void {
    this.metadataService.getMetadata().subscribe(
      data => {
        if (data) {
          this.metadata = data;
          this.lastMatchingMetadata = data; // Store the last matching metadata
          console.log('Metadata received:', this.metadata);
        } else if (this.lastMatchingMetadata) {
          console.log('Using last matching metadata');
          this.metadata = this.lastMatchingMetadata; // Use the last matching metadata
        } else {
          console.warn('No matching metadata found or error occurred');
          this.metadata = null; // Set metadata to null if no match or error and no last matching metadata
        }
      },
      error => console.error('Error fetching metadata:', error)
    );
  }
}