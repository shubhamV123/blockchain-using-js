const BlockChain = require('./blockchain');

const bitcoin = new BlockChain();
console.log(bitcoin);

// bitcoin.createNewBlock(789457, 'OIUOEDJETH8754DHKD', '78SHNEG45DER56');

// bitcoin.createNewTransaction(100, 'ALEXHT845SJ5TKCJ2', 'JENN5BG5DF6HT8NG9');

// bitcoin.createNewBlock(548764, 'AKMC875E6S1RS9', 'WPLS214R7T6SJ3G2');

// bitcoin.createNewTransaction(50, 'ALEXHT845SJ5TKCJ2', 'JENN5BG5DF6HT8NG9');
// bitcoin.createNewTransaction(200, 'ALEXHT845SJ5TKCJ2', 'JENN5BG5DF6HT8NG9');
// bitcoin.createNewTransaction(300, 'ALEXHT845SJ5TKCJ2', 'JENN5BG5DF6HT8NG9');
// bitcoin.createNewBlock(548764, 'AKMC875E6S1RS9', 'WPLS214R7T6SJ3G2');
// const previousBlockHash = '87765DA6CCF0668238C1D27C35692E11';
// const currentBlockData = [
//     {
//         amount: 10,
//         sender: 'B4CEE9C0E5CD571',
//         recipient: '3A3F6E462D48E8',
//     },
//     {
//         amount: 100,
//         sender: 'B4CWE9C0E5CD571',
//         recipient: '3A3F6E462D48E9',
//     },
//     {
//         amount: 10,
//         sender: 'B4CEEFC0E5CD571',
//         recipient: '3A3J6E462D48E9',
//     }
// ];
// const nonce = 100;
// // bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);

const testingBlockchaing = [
    {
        "index": 1,
        "timestamp": 1556649790161,
        "transactions": [

        ],
        "nonce": 100,
        "hash": "0",
        "previousBlockHash": "0"
    },
    {
        "index": 2,
        "timestamp": 1556649799491,
        "transactions": [

        ],
        "nonce": 18140,
        "hash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
        "previousBlockHash": "0"
    },
    {
        "index": 3,
        "timestamp": 1556649803509,
        "transactions": [
            {
                "amount": 12.5,
                "sender": "00",
                "recipient": "cd53eb206b7711e98ccb17f51c7d0996",
                "transactionId": "d2e7aef06b7711e98ccb17f51c7d0996"
            }
        ],
        "nonce": 79912,
        "hash": "000052669e3e72ec038d12be36e89e34c12f5ecda9f9e5292fba3d15d32aed70",
        "previousBlockHash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
    },
    {
        "index": 4,
        "timestamp": 1556649820979,
        "transactions": [
            {
                "amount": 12.5,
                "sender": "00",
                "recipient": "cd53eb206b7711e98ccb17f51c7d0996",
                "transactionId": "d5496cb06b7711e98ccb17f51c7d0996"
            },
            {
                "amount": 59000,
                "sender": "JKCWE9C0E5CD573",
                "recipient": "8A3F6E462D48E9",
                "transactionId": "d6a15b906b7711e98ccb17f51c7d0996"
            },
            {
                "amount": 89000,
                "sender": "JKCWE9C0E5CD573",
                "recipient": "8A3F6E462D48E9",
                "transactionId": "db96bc806b7711e98ccb17f51c7d0996"
            },
            {
                "amount": 45000,
                "sender": "JKCWE9C0E5CD573",
                "recipient": "8A3F6E462D48E9",
                "transactionId": "de416a206b7711e98ccb17f51c7d0996"
            }
        ],
        "nonce": 6875,
        "hash": "000067e071824fc26e988852b9f35d6f8b92b57d53f35aba8f58e9f61ab65d18",
        "previousBlockHash": "000052669e3e72ec038d12be36e89e34c12f5ecda9f9e5292fba3d15d32aed70"
    },
    {
        "index": 5,
        "timestamp": 1556649829786,
        "transactions": [
            {
                "amount": 12.5,
                "sender": "00",
                "recipient": "cd53eb206b7711e98ccb17f51c7d0996",
                "transactionId": "dfb286506b7711e98ccb17f51c7d0996"
            }
        ],
        "nonce": 174379,
        "hash": "0000f69f8e923f16fcdfc4d026e377c4b39f3a9cece9bc4feb087f46f3fba5e0",
        "previousBlockHash": "000067e071824fc26e988852b9f35d6f8b92b57d53f35aba8f58e9f61ab65d18"
    },
    {
        "index": 6,
        "timestamp": 1556649834759,
        "transactions": [
            {
                "amount": 12.5,
                "sender": "00",
                "recipient": "cd53eb206b7711e98ccb17f51c7d0996",
                "transactionId": "e4f25dc06b7711e98ccb17f51c7d0996"
            }
        ],
        "nonce": 35648,
        "hash": "0000a14a54203aeb133b1d8b4d48f3f5c944dc6f444bf6c4dbcd1c836c3cda9b",
        "previousBlockHash": "0000f69f8e923f16fcdfc4d026e377c4b39f3a9cece9bc4feb087f46f3fba5e0"
    }
]
console.log(bitcoin.chainIsValid(testingBlockchaing));
