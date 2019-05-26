const sha256 = require('sha256');
const currentNodeURL = process.argv[3];
const uuid = require('uuid/v1');

/*
Blockchain is pretty much a list of blocks.Every single block has to be created and added to chain
.Proof of Work ensure that our blockchain are secure.
 */
function BlockChain() {
    console.log(process.argv, currentNodeURL);
    this.chain = []; //All of the blocks that we mine will be stored in this particular array as a chain
    this.pendingTransaction = []; //All of the new transactions that are created before they are placed into a block.
    this.currentNodeURL = currentNodeURL;
    this.networkNodes = [];
    this.createNewBlock(100, '0', '0');// first block in any blockchain also known as genesis block
}
BlockChain.prototype.createNewBlock = function (nonce, previousBlockHash, hash) {
    /*
     * hash and previousBlockHash are both hashes. The only difference is that the hash property deals with the data of the current block, and, the previousBlockHash property deals with the hashing of the data of the previous block.  
     * This is how you create a new block,
     * and this is what every block in our blockchain will look like.

     */
    const newBlock = {//new block inside of our BlockChain
        index: this.chain.length + 1, //index value will basically be the block number,
        timestamp: Date.now(),
        transactions: this.pendingTransaction,//all of the new transactions or the pending transactions that have just been created into the new block 
        nonce: nonce, // nonce is pretty much proof that we've created this new block in a legitimate way by using a proofOfWork method.
        hash: hash,// all of our transactions are going to be compressed into a single string of code, which will be our hash.
        previousBlockHash: previousBlockHash // data from our previous block or the previous block to the current block hashed into a string.
    };
    this.pendingTransaction = [];  //clear out the entire new transactions array so that we can start over for the next block and already stored in newBlock
    this.chain.push(newBlock);

    return newBlock;

}
BlockChain.prototype.getLastBlock = function () {
    return this.chain[this.chain.length - 1];
}
BlockChain.prototype.createNewTransaction = function (amount, sender, recipient) {
    const newTransaction = {
        amount,
        sender,
        recipient,
        transactionId: uuid().split('-').join('')
    }
    // this.pendingTransaction.push(newTransaction);
    // return this.getLastBlock()['index'] + 1
    return newTransaction;
}
//For generation hash function we are going to use sha256
//currentBlockData simply array of transcations present in this block
BlockChain.prototype.hashBlock = function (previousBlockHash, currentBlockData, nonce) {
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    const hash = sha256(dataAsString);
    return hash;

}
/*
It takes a lot of work to generate a proof of work, but it is very easy to verify that it is correct.
*/
BlockChain.prototype.proofOfWork = function (previousBlockHash, currentBlockData) {
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData,
        nonce);
    while (hash.substring(0, 4) !== '0000') {
        nonce++;
        hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    }
    return nonce;
}

BlockChain.prototype.addTransactionToPendingTransactions = function (transactionObj) {
    this.pendingTransaction.push({ ...transactionObj, transactionId: uuid().split('-').join('') });
    return this.getLastBlock()['index'] + 1;
}

BlockChain.prototype.chainIsValid = function (blockchain) {
    let validChain = true;
    const genesisBlock = blockchain[0];
    const correctNonce = genesisBlock['nonce'] === 100;
    const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0';
    const correctHash = genesisBlock['hash'] === '0';
    const correctTransactions = genesisBlock['transactions'].length === 0;
    if (!correctNonce || !correctPreviousBlockHash || !correctHash || !correctTransactions) validChain = false;

    for (var i = 1; i < blockchain.length; i++) {
        const currentBlock = blockchain[i];
        const previousBlock = blockchain[i - 1];
        const blockHash = this.hashBlock(previousBlock['hash'], { transactions: currentBlock['transactions'], index: currentBlock['index'] }, currentBlock['nonce'])
        if (currentBlock['previousBlockHash'] !== previousBlock['hash']) {//chain is not valid
            validChain = false
        }
        if (blockHash.substring(0, 4) !== '0000') validChain = false;
    }
    return validChain;
};
//Get the particular block from blockchain which consist this hash
BlockChain.prototype.getBlock = function (blockHash) {
    let correctBlock = null;
    this.chain.forEach(block => {
        if (block.hash === blockHash) {
            correctBlock = block
        }
    });
    return correctBlock;
};
//Get the particular transaction from blockchain which consist this transactionId
BlockChain.prototype.getTransaction = function (transactionId) {
    let correctTransaction = null;
    let correctBlock = null;

    this.chain.forEach(block => {
        block.transactions.forEach(transaction => {
            if (transaction.transactionId === transactionId) {
                correctTransaction = transaction;
                correctBlock = block;
            }
        })
    });
    return { transaction: correctTransaction, block: correctBlock };
};

//Get the data for specific address 
BlockChain.prototype.getAddressData = function (address) {

    const addressTransactions = [];
    let balance = 0;
    this.chain.forEach(block => {
        block.transactions.forEach(transaction => {
            let { sender, recipient } = transaction;
            if (sender === address || recipient === address) {
                addressTransactions.push(transaction)
            }
        })
    });
    addressTransactions.forEach(transaction => {
        let { sender, recipient, amount } = transaction;
        if (recipient === address) {
            balance = balance + amount
        }
        else if (sender === address) {
            balance = balance - amount;
        }
    });
    return {
        addressTransactions,
        addressBalance: balance
    }

};

module.exports = BlockChain;