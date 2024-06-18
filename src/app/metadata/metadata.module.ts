import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MetadataPageRoutingModule } from './metadata-routing.module';

import { MetadataPage } from './metadata.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MetadataPageRoutingModule
  ],
  declarations: [MetadataPage]
})
export class MetadataPageModule {}
