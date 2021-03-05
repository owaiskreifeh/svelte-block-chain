import CryptoRSA from  'js-crypto-rsa'
import { Chain, Transaction, WorldEventEmitter } from '.';

export class Wallet extends WorldEventEmitter {
    constructor(hodlerName){
        this._name = hodlerName;
        this._transactions = [];
        this.isInitialized = false;
    }

    get balance () { 
        let _balance = 0;
        this._transactions.forEach(trx => {
            if (trx.receiverPk == this._publickKey){
                _balance += trx.amount;
            } else {
                _balance -= trx.amount;
            }
        })
    };

    get name () { return this._name; }
    get publicKey () { return this._publickKey; }
    get info () { return `NAME:${this.name}|BALANCE:${this.balance}|PubK:${this.publicKey}` }

    sendMoney(amount, receiverPublicKey){
        if (!this.isInitialized) {
            console.warn(this.name, " Wallet is not initialized yet")
            return;
        }
        const trx = new Transaction(amount, this._publickKey, receiverPublicKey);
        CryptoRSA.sign(trx.toString(), this._privateKey, 'SHA-256')
        .then(signature => {
            this._balance -= amount;
            Chain.instance.createTransaction(trx, signature);
            this.updateWorld(WorldEvent.TYPES.WALLET_SEND_MONEY, trx)    
        })
    }

    addTransaction(transaction){
        this._transactions.push(transaction);
    }

    init = () => { 
        return CryptoRSA.generateKey(2048)
        .then(keys => {
            this._publickKey = keys.publicKey;
            this._privateKey = keys.privateKey;
            this.isInitialized = true;
            this.updateWorld(WorldEvent.TYPES.WALLET_CREATE_NEW, this)
        })
    }
}
