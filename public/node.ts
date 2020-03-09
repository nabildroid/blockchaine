import BlockChain from "../blockchain/blockchain";
import P2P from "./p2p";
import { users, db, timestamp } from "./firebase";

// generate unique user id

class Node {
    id: number;
    nodes: P2P[];
    connection: P2P;
    constructor(bc?: BlockChain) {
        this.id = Math.round(Math.random() * 1000);
        this.connection = undefined;
    }
    async connectToNodes() {
        this.nodes = [];
        const peers = await users(this.id);
        console.log(peers);
        peers.forEach(({ signal, id }) => {
            const node = P2P.create(id, this.receive);
            node.setSignal(signal);
            this.nodes.push(node);
        });
        await this.broadcast();
    }

    async broadcast() {
        this.connection = P2P.create(this.id, this.receive);
        const signal = await this.connection.getSignal();
        db.collection("users").add({
            id: this.id,
            signal,
            timestamp: timestamp()
        });
    }
    send(data: Object) {
        const nodes = this.nodes.concat(this.connection).filter(c => c);
        nodes.forEach(node => node.send(data));
    }
    receive(data: Object, id: number) {
        if (id == this.id) return;
        console.log(`receive from ${this.id}`, data);
    }
}

export default Node;
