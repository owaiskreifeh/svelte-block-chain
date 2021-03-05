
export class WorldEvent {
    static TYPES = {
        CHAIN_ADD_BLOCK: 10,
        WALLET_CREATE_NEW: 20,
        WALLET_SEND_MONEY: 21,
        MINER_STATUS_CHANGE: 30,
    }
    constructor (emitter, type, data){
        this.type = type;
        this.data = data;
        this.emitter = emitter;
        this.tc = Date.now();
    }
}
