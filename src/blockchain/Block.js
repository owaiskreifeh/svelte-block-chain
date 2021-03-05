import { generator as rndGen } from 'random-number';
import Crypto from 'crypto-js';

export class Block {
    nonce = rndGen({ min: 0, max: 9999999, integer: true })();
    hash = null;

    constructor(prevHash, trx){
        this.prevHash = prevHash;
        this.trx = trx;
        this.ts = Date.now();
        // generate hash
        this.hash = Crypto.SHA256(JSON.stringify(this)).toString(Crypto.enc.Hex);
        console.log(this.hash)
    }
}