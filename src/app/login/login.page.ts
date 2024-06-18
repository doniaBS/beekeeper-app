import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  web3: any;
  provider: any;
  account: string = '';

  constructor(private router: Router) {}

  async login() {
    this.provider = await detectEthereumProvider();
    if (this.provider) {
      this.web3 = new Web3(this.provider);
      try {
        await this.provider.request({ method: 'eth_requestAccounts' });
        const accounts = await this.web3.eth.getAccounts();
        this.account = accounts[0];
        console.log('Connected account:', this.account);
        this.router.navigate(['/metadata']);
      } catch (error) {
        console.error('User denied account access', error);
      }
    } else {
      console.error('Please install MetaMask!');
    }
  }
}