import P2P from "./p2p";
import * as server from "./server";

// generate unique user id
/**
 * Node
 * Broadcast to many
 * listen to one broadcaster
 */
class Node {
    id: number;
    nodes: P2P[]; // this node listen to broadcasters
    connections: P2P[]; // this node broadcast
    constructor() {
        this.nodes = [];
        this.connections = [];
        this.id = Math.round(Math.random() * 10000);
        console.log(`Node ID:${this.id}`);
        server.listeners(this.id, this.listeners.bind(this));
    }
    /**
     * connect to all broadcasters as a listener
     */
    async connectToNodes() {
        const broadcasters = await server.broadcasters(this.id);
        console.log(`find ${broadcasters.length} broadcaster online`);

        await broadcasters.forEach(async broadcast => {
            console.log(`Broadcaster ID:${broadcast.id}`);
            await broadcast.ref.delete();

            const node = P2P.create(broadcast.id, this.receive.bind(this));
            // set the offer
            node.setSignal(broadcast.signal);
            // get the answar
            const answar = await node.getSignal();

            server.listen(this.id, answar, broadcast);
            this.nodes.push(node);
        });

        await this.broadcast();
        return broadcasters;
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
            node.ref.delete();
            console.log(`${this.id}_Answaring: ${node.id}`);
            console.log(node, this.connections);
            console.log("--------");

            const peer = this.connections.find(c => c.index == node.index);
            console.log("peer:", peer);
            if (peer) {
                try {
                    // broadcaset respond to listener answar
                    console.log(
                        `${node.id} send an Answar to ${this.id}/${node.index}`
                    );
                    peer.id = node.id;
                    peer.setSignal(node.signal);
                    this.broadcast();
                } catch (e) {
                    console.error("response to listener error", e);
                }
            }
        });
        console.log("listener event finished");
    }

    send(data: Object) {
        this.nodes.concat(this.connections).forEach(node => node.send(data));
    }
    receive(data: any, id: number) {
        const { time } = data;
        console.log(
            `litency to connect with ${id}: `,
            Math.abs(new Date().getTime() - time)
        );
    }
}

export default Node;
