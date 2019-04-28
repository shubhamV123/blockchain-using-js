const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const uuid = require('uuid/v1');
const Blockchain = require('./blockchain');
const bitcoin = new Blockchain();

const nodeAddress = uuid().split('-').join('');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//allows us to fetch our entire blockchain
app.get('/blockchain', function (req, res) {
    res.send(bitcoin);
})
//allows us to create a new transaction
app.post('/transaction', function (req, res) {
    let { amount, sender, recipient } = req.body;
    let blockIndex = bitcoin.createNewTransaction(amount, sender, recipient);
    res.json({ note: `Transaction will be added in block${blockIndex}.` });
});
//allow us to mine a new block by using the proofOfWork method
app.get('/mine', function (req, res) {
    bitcoin.createNewTransaction(12.5, "00", nodeAddress);
    const lastBlock = bitcoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockData = { transactions: bitcoin.pendingTransaction, index: lastBlock['index'] + 1 };
    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
    const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);
    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);



    res.json({
        note: "New block mined successfully",
        block: newBlock
    });
})

app.listen(3000, function () {
    console.log('listening on port 3000...');

});