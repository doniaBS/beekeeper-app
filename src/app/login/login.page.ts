import { Component } from '@angular/core';
import { MetadataService } from '../services/metadata.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  constructor(private metadataService: MetadataService) {}

  async login() {
    await this.metadataService.loginWithMetaMask();
  }
}