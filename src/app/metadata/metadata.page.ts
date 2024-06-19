import { Component, OnInit } from '@angular/core';
import { MetadataService } from '../services/metadata.service';

@Component({
  selector: 'app-metadata',
  templateUrl: './metadata.page.html',
  styleUrls: ['./metadata.page.scss'],
})
export class MetadataPage implements OnInit {
  metadata: any;

  constructor(private metadataService: MetadataService) {}

  ngOnInit(): void {
    this.metadataService.getMetadata().subscribe(
      data => {
        this.metadata = data;
        console.log('Metadata received:', this.metadata);
      },
      error => console.error('Error fetching metadata:', error)
    );
  }
}