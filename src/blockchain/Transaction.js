

export class Transaction {
    constructor(amount, senderPk, receiverPk){
        this.amount = amount; // in FUCK Coins
        this.senderPk = senderPk; // PK
        this.receiverPk = receiverPk; // PK
    }

    toString(){
        return JSON.stringify(this)
    }
}