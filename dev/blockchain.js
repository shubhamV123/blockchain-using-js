const sha256 = require('sha256');

/*
Blockchain is pretty much a list of blocks.Every single block has to be created and added to chain
.Proof of Work ensure that our blockchain are secure.
 */
function BlockChain() {
    this.chain = []; //All of the blocks that we mine will be stored in this particular array as a chain
    this.pendingTransaction = []; //All of the new transactions that are created before they are placed into a block.
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
        recipient
    }
    this.pendingTransaction.push(newTransaction);
    return this.getLastBlock()['index'] + 1
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
module.exports = BlockChain;