import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IpfsService {

  constructor() {}

  async addDataToPinata(data: any): Promise<any> {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    const headers = {
      pinata_api_key: environment.pinataApiKey,
      pinata_secret_api_key: environment.pinataSecretApiKey
    };

    try {
      const response = await axios.post(url, data, { headers });
      return response.data.IpfsHash; // Return the IPFS hash
    } catch (error) {
      console.error('Error adding data to Pinata:', error);
      throw error;
    }
  }
}
