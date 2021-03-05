import { WorldEventEmitter } from ".";
import Crypto from "crypto-js";
import CryptoRSA from "js-crypto-rsa";

export class Miner extends WorldEventEmitter {
    static STATUS = {
        IDLE: 0,
        BUSY: 1,
    };
    wallet = null;
    _status = Miner.STATUS.IDLE;

    set status(__status) {
        this._status = __status;
        this.updateWorld(WorldEvent.TYPES.MINER_STATUS_CHANGE, __status);
    }

    get status() {
        return this._status;
    }

    constructor(wallet) {
        this.wallet = wallet;
    }

    run() {
        this.status = Miner.STATUS.BUSY;
        const _nextTrxPromise = Chain.instance.nextTrxPromise;
        if (_nextTrxPromise) {
            this._addBlock(_nextTrxPromise);
        } else {
            this.status = Miner.STATUS.IDLE;
        }
    }

    _mine(blockNonce) {
        let solution = 1;
        while (1) {
            const hash = Crypto.MD5(blockNonce + solution).toString(
                Crypto.enc.Hex
            );
            if (hash.startsWith(Chain.mineGoalPrefix)) {
                return {
                    hash,
                    solution,
                };
            }
            solution++;
        }
    }

    _addBlock(trxPromise) {
        CryptoRSA.verify(
            trxPromise.trx,
            trxPromise.signature,
            trxPromise.trx.senderPublicKey,
            "SHA-256"
        ).then((isValid) => {
            if (isValid) {
                const block = new Block(
                    Chain.instance.lastBlock.hash,
                    trxPromise.trx
                );
                trxPromise.solution = this._mine(block.nonce);
                trxPromise.finishedAt = Date.now();
                trxPromise.verfiedBy = this;
                trxPromise.block = block;

                Chain.instance.addBlock(trxPromise);
            } else {
                console.warn("TRX PROMISE INVALID", trxPromise);
            }
        });
    }
}
