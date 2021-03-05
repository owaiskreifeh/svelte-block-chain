import { Chain, Miner, Wallet, WorldEvent } from ".";


export class World {
    static instance = new World();

    _chain = Chain.instance;
    _wallets = [];
    _miners = [];
    _worldWallet = new Wallet("WORLD");

    render = console.log

    createWallet (hodlerName) {
        const wallet = new Wallet(hodlerName);
        this._wallets.push(wallet);
        return wallet;
    }

    createMiner (wallet) {
        const miner = new Miner(wallet);
        this._miners.push(miner);
        return miner;
    }

    update(event) {
        switch(event.type) {
            case WorldEvent.TYPES.CHAIN_ADD_BLOCK:
                this._rewardMiner(event.data.verfiedBy.wallet);
                this._updateTransactionsForWallets(event.data.trx);
        }

        this.render(event);
    }

    _rewardMiner(minerWallet) {
        this._worldWallet.sendMoney(20, minerWallet.publicKey)
    }

    _updateTransactionsForWallets(trx){
        let sender, receiver;
        this._wallets.forEach(wallet => {
            if(trx.senderPublicKey == wallet.publicKey){
                sender = wallet;
            } 

            if(trx.receiverPublicKey == wallet.publicKey){
                receiver = wallet;
            }
        });

        sender.addTransaction(trx);
        receiver.addTransaction(trx)
    }
}

