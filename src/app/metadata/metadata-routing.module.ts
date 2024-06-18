import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MetadataPage } from './metadata.page';

const routes: Routes = [
  {
    path: '',
    component: MetadataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MetadataPageRoutingModule {}
