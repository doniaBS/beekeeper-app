// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  gatewayWsUrl: 'ws://localhost:8765',
  contractABI : [ 
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
          "indexed": false,
          "name": "beekeeperId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "beekeeperAddress",
          "type": "address"
        }
      ],
      "name": "beekeeperIdBeekeeperAddress",
      "type": "event",
      "signature": "0x82fc758beb45430ad6779b890bace00d6cc0f9f5027be9f7b097331c465b1863"
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
    }
  ],
  contractAddress : '0x16EBeb44B715379db53Bde3FaE8879274dEaf51c'
  //pinataApiKey: 'your-pinata-api-key',
  //pinataSecretApiKey: 'your-pinata-secret-api-key',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
