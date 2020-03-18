const SHA256 = require("crypto-js/sha256");
export default class Block {
    timestamp: number;
    lastHash: string;
    data: object;
    hash: string;
    constructor(
        timestamp: number,
        data: object,
        lastHash: string,
        hash: string
    ) {
        this.timestamp = timestamp;
        this.data = data;
        this.lastHash = lastHash;
        this.hash = hash;
    }
    toString() {
        return `Block -- 
            Timestamp: ${this.timestamp}
            Data: ${JSON.stringify(this.data)}
            Last Hash: ${this.lastHash.substr(0, 10)}...
            Hash: ${this.hash.substr(0, 10)}...
        `;
    }
    stringify() {
        return JSON.stringify(this);
    }
    static genesis() {
        const timestamp = 0;
        const data = {};
        const lastHash = "-----";
        const hash = this.generateHash(timestamp, data, lastHash);

        return new this(timestamp, data, lastHash, hash);
    }
    static mineBlock(lastBlock: Block, data: object) {
        const timestamp = Date.now();
        const lastHash = lastBlock.hash;
        const hash = this.generateHash(timestamp, data, lastHash);
        return new this(timestamp, ["hello world"], lastHash, hash);
    }
    static generateHash(timestamp: number, data: {}, lastHash: string): string {
        return SHA256(JSON.stringify({ ...arguments })).toString();
    }
    static blockHash(block: Block) {
        const { timestamp, data, lastHash } = block;
        return this.generateHash(timestamp, data, lastHash);
    }
}
