// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  gatewayWsUrl: 'ws://localhost:8765',
  contractABI : [ 
    {
      "constant": true,
      "inputs": [],
      "name": "ipfsHashCount",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0xfe250911"
    },
    {
      "inputs": [
        {
          "name": "_ganacheAddresses",
          "type": "address[]"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor",
      "signature": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "hashIndex",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "ipfsHash",
          "type": "string"
        }
      ],
      "name": "ipfsHashStore",
      "type": "event",
      "signature": "0x80738acc89913722136c6a958e89af27743e61b28bf112bb22814097c798e104"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "beekeeperId",
          "type": "uint256"
        }
      ],
      "name": "getBeekeeperAddress",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xb137ca64"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "ipfsHash",
          "type": "string"
        }
      ],
      "name": "storeIpfsHash",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xcacde1d0"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "getIpfsHash",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0xd450fbc9"
    }
  ],
  contractAddress : '0x41CA45648Eb235164DD2aF09B55A1Df96B1249d4',
  pinataApiKey: 'd4ff07b0e166ec5b7db8',
  pinataSecretApiKey: '1da36dca5acaa1640cf937790bf16129e9dc9d97c6c1d32df5c16d402b0ed0da',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
