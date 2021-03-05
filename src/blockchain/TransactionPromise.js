

export class TransactionPromise {
    constructor (trx, signature) {
        this.trx = trx;
        this.signature = signature;
        this.taken = false;
        this.finishedAt = null;
        this.verfiedBy = null;
        this.block = null;
        this.solution = null;
    }
}


