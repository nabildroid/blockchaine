import P2P from "./p2p";
import * as server from "./server";

// generate unique user id
/**
 * Node
 * Broadcast to many
 * listen to one broadcaster
 *
 */
class Node {
    id: number;
    nodes: P2P[];
    connections: P2P[];
    constructor() {
        this.nodes = [];
        this.connections = [];
        this.id = Math.round(Math.random() * 10000);
        console.log(`Node ID:${this.id}`);
        server.listeners(this.id, this.listeners.bind(this));
    }
    async connectToNodes() {
        const peers = await server.broadcasters(this.id);
        console.log(`find ${peers.length} broadcaster online`);

        await peers.forEach(async broadcast => {
            console.log(`Broadcaster ID:${broadcast.id}`);
            if (broadcast.id != this.id) {
                await broadcast.ref.delete();

                const node = P2P.create(broadcast.id, this.receive.bind(this));

                node.setSignal(broadcast.signal);
                const answar = await node.getSignal();

                server.listen(this.id, node.index, answar, broadcast);
                this.nodes.push(node);
            }
        });

        await this.broadcast();
    }

    async broadcast() {
        if (this.connections.length < 10) {
            const node = new P2P(this.id, true);
            node.receive(this.receive.bind(this));

            const signal = await node.getSignal();
            server.broadcast(this.id, node.index, signal);

            console.log(`new Broadcast ID: ${node.id}`);
            this.connections.push(node);
        }
    }
    listeners(nodes: server.ListenerType[]) {
        console.log("listener event started");
        nodes.forEach(node => {
            //node.ref.delete();
            console.log(`${this.id}_Answaring: ${node.id}`);
            console.log(node, this.connections);
            console.log("--------");

            const peer = this.connections.find(c => c.index == node.index);
            console.log("peer:", peer);
            if (peer) {
                try {
                    peer.setSignal(node.signal);
                    this.broadcast();
                } catch (e) {}
            }
        });
        console.log("listener event finished");
    }
    send(data: Object) {
        this.nodes.forEach(node => node.send(data));
    }
    receive(data: Object, id: number) {
        if (id == this.id) return;
        console.log(`receive from ${this.id}`, data);
    }
}

export default Node;
