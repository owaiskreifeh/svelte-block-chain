import { WorldEventEmitter, Block, TransactionPromise } from "./";
import Crypto from "crypto-js";
import { Transaction } from "./Transaction";

export class Chain extends WorldEventEmitter {
    static instance = new Chain();
    static mineGoalPrefix = "00";

    constructor() {
        super();
        this._trxPromises = [];

        this.chain = [
            new Block(
                "" /** empty lastHash */,
                new Transaction(100, "void", "master") /** First transaction */
            ),
        ];
    }

    get lastBlock() {
        return this.chain[this.chain.length - 1];
    }

    get nextTrxPromise() {
        let _next = this._trxPromises.find((trxPromise) => !trxPromise.taken);
        _next.taken = true;
        return _next;
    }

    get trxPromises() {
        return this._trxPromises.filter(
            (trxPromise) => trxPromise.finishedAt === null
        );
    }

    createTransaction(trx, signature) {
        this.trxPromises.push(new TransactionPromise(trx, signature));
    }

    addBlock = (trxPromise) => {
        // verfiy solution
        const hash = Crypto.MD5(
            trxPromise.block.nonce + trxPromise.solution.solution
        ).toString(Crypto.enc.Hex);
        if (hash == trxPromise.solution.hash) {
            this.chain.push(trxPromise.block);
            this.updateWorld(WorldEvent.TYPES.CHAIN_ADD_BLOCK, trxPromise);
        }
    };
}
