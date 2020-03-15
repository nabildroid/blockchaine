import Node from "./p2p/node";
import BlockChain from "../blockchain/blockchain";
import Block, { BlockType } from "../blockchain/block";

class Network extends Node {
    bc: BlockChain;
    constructor(bc: BlockChain) {
        super();

        this.bc = bc;
    }
    push() {
        const chain: BlockType[] = this.bc.chain.map(
            ({ data, timestamp, lastHash, hash, nonce }) => ({
                data,
                timestamp,
                lastHash,
                nonce,
                hash
            })
        );

        this.send(chain);
    }
    receive(data: BlockType[]) {
        const chain = data.map(block => {
            const { data, timestamp, lastHash, hash, nonce } = block;
            return new Block(timestamp, data, lastHash, nonce, hash);
        });
        const agree = this.bc.replaceChain(chain);
        if (this.events.receive) this.events.receive(agree);
        console.log(
            `new BlockChain received & ${agree ? "accepted" : "rejected"}`
        );
    }
}
export default Network;
