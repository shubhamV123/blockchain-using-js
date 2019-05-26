const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const uuid = require('uuid/v1');
const rp = require('request-promise');
const morgan = require('morgan');

const Blockchain = require('./blockchain');
const bitcoin = new Blockchain();
const port = process.argv[2];


const nodeAddress = uuid().split('-').join('');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

//  allows us to fetch our entire blockchain
app.get('/blockchain', function (req, res) {
    res.send(bitcoin);
})
// allows us to create a new transaction
app.post('/transaction', function (req, res) {
    let newTransaction = req.body;
    let blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction);
    res.json({ note: `Transaction will be added in block${blockIndex}.` });
});
// allow us to mine a new block by using the proofOfWork method
app.get('/mine', function (req, res) {
    // bitcoin.createNewTransaction(12.5, "00", nodeAddress); 
    const lastBlock = bitcoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockData = { transactions: bitcoin.pendingTransaction, index: lastBlock['index'] + 1 };
    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
    const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);
    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);
    const requestPromises = [];

    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            url: networkNodeUrl + '/receive-new-block',
            method: 'POST',
            body: { newBlock: newBlock },
            json: true
        }
        requestPromises.push(rp(requestOptions))
    });
    Promise.all(requestPromises)
        .then(data => {
            const requestOptions = {
                url: bitcoin.currentNodeURL + '/transaction/broadcast',
                method: 'POST',
                body: {
                    amount: 12.5,
                    sender: "00",
                    recipient: nodeAddress
                },
                json: true
            };
            return rp(requestOptions);
        })
        .then(_ => {
            res.json({
                note: "New block mined & broadcast successfully",
                block: newBlock
            });
        })


});
app.post('/receive-new-block', function (req, res) {
    const newBlock = req.body.newBlock;
    const lastBlock = bitcoin.getLastBlock();
    const correctHash = newBlock.previousBlockHash === lastBlock.hash;
    const correctIndex = lastBlock['index'] + 1 === newBlock['index'];
    if (correctHash && correctIndex) {
        bitcoin.chain.push(newBlock);
        bitcoin.pendingTransaction = [];
        res.json({
            note: 'New block received and accepted.',
            newBlock: newBlock
        })
    }
    else {
        res.json({
            note: 'New block rejected',
            newBlock: newBlock
        })
    }

});
// register all of the different nodes that we have with it
app.post('/register-and-broadcast-node', function (req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    if (!bitcoin.networkNodes.includes(newNodeUrl) && bitcoin.currentNodeURL !== newNodeUrl) {
        bitcoin.networkNodes.push(newNodeUrl);
    }
    const regNodesPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        console.log("NETWORK NODE URL", networkNodeUrl)
        const requestOptions = {
            url: networkNodeUrl + '/register-node',
            method: 'POST',
            body: { newNodeUrl: newNodeUrl },
            json: true

        };
        regNodesPromises.push(rp(requestOptions));
    });
    Promise.all(regNodesPromises).then(data => {
        console.log("N/W nodes", bitcoin.networkNodes)
        const bulkRegisterOptions = {
            url: newNodeUrl + '/register-nodes-bulk',
            method: 'POST',
            body: {
                allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeURL]
            },
            json: true
        }
        return rp(bulkRegisterOptions)
    }).then(data => {
        res.json({ note: 'New Node registered with network successfully' });
    })

})
// This endpoint will register a node with the network.
app.post('/register-node', function (req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    const notInNetworkNodes = !bitcoin.networkNodes.includes(newNodeUrl);
    const notCurrentNode = newNodeUrl !== bitcoin.currentNodeURL
    if (notInNetworkNodes && notCurrentNode) {
        bitcoin.networkNodes.push(newNodeUrl);
    }

    res.json({ note: 'New node registered successfully.' });

});
// This endpoint will register multiple nodes at once.
app.post('/register-nodes-bulk', function (req, res) {

    const allNetworkNodes = req.body.allNetworkNodes;
    allNetworkNodes.forEach(networkNodeUrl => {

        const notCurrentNode = bitcoin.currentNodeURL !== networkNodeUrl;
        //not present in network nodes
        if (!bitcoin.networkNodes.includes(networkNodeUrl) && notCurrentNode) {
            bitcoin.networkNodes.push(networkNodeUrl)
        }
    });
    res.json({ note: 'Bulk registration successful.' });
});

app.post('/transaction/broadcast', function (req, res) {
    let { amount, sender, recipient } = req.body;
    const newTransaction = bitcoin.createNewTransaction(amount, sender, recipient);
    bitcoin.addTransactionToPendingTransactions(newTransaction);
    const requestPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            url: networkNodeUrl + '/transaction/',
            method: 'POST',
            body: newTransaction,
            json: true
        }
        requestPromises.push(rp(requestOptions))
    });
    Promise.all(requestPromises).then(data => {
        res.json({ note: 'Transaction created and broadcast successfully.' })
    })
});

//Concensus Endpoin

app.get('/consensus', function (req, res) {
    const requestPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            url: networkNodeUrl + '/blockchain',
            method: 'GET',
            json: true
        };
        requestPromises.push(rp(requestOptions));
    });
    Promise.all(requestPromises).then(blockchains => {
        const currentChainLength = bitcoin.chain.length;
        let maxChainLength = currentChainLength;
        let newLongestChain = null;
        let newPendingTransactions = null;
        blockchains.forEach(blockchain => {
            if (blockchain.chain.length > maxChainLength) {
                maxChainLength = blockchain.chain.length;
                newLongestChain = blockchain.chain;
                newPendingTransactions = blockchain.pendingTransaction;

            }
        });
        if (!newLongestChain || (newLongestChain && !bitcoin.chainIsValid(newLongestChain))) {
            res.json({
                note: 'Current chain has not been replaced.',
                chain: bitcoin.chain
            });
        }
        else {
            bitcoin.chain = newLongestChain;
            bitcoin.pendingTransaction = newPendingTransactions;
            res.json({
                note: 'This chain has been replaced.',
                chain: bitcoin.chain
            });
        }
    })
});
//return a block of queried blockhash
app.get('/block/:blockHash', function (req, res) {
    const blockHash = req.params.blockHash;
    const correctBlock = bitcoin.getBlock(blockHash);
    res.json({
        block: correctBlock
    });
});
// return correct transaction that this id corresponds
app.get('/transaction/:transactionId', function (req, res) {
    const transactionId = req.params.transactionId;
    const transactionData = bitcoin.getTransaction(transactionId);
    res.json({
        transaction: transactionData.transaction,
        block: transactionData.block
    });
});

//return all transaction to that specific address
app.get('/address/:address', function (req, res) {
    const address = req.params.address;
    const addressData = bitcoin.getAddressData(address);
    res.json({
        addressData: addressData
    });
});

app.get('/block-explorer', function (req, res) {
    res.sendFile('./block-explorer/index.html', { root: __dirname })
})

app.listen(port, function () {
    console.log(`listening on port ${port}...`);

});