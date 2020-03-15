const SHA256 = require("crypto-js/sha256");

export const DIFFICULTY = 2;
export type BlockType = {
    data: object;
    timestamp: number;
    lastHash: string;
    nonce: number;
    hash: string;
};

export default class Block {
    timestamp: number;
    lastHash: string;
    data: object;
    nonce: number;
    hash: string;
    constructor(
        timestamp: number,
        data: object,
        lastHash: string,
        nonce: number,
        hash: string
    ) {
        this.timestamp = timestamp;
        this.data = data;
        this.lastHash = lastHash;
        this.nonce = nonce;
        this.hash = hash;
    }
    toString() {
        return `Block -- 
            Timestamp: ${this.timestamp}
            Data     : ${JSON.stringify(this.data)}
            Last Hash: ${this.lastHash.substr(0, 10)}...
            nonce    : ${this.nonce}
            Hash     : ${this.hash.substr(0, 10)}...
        `;
    }
    stringify() {
        return JSON.stringify(this);
    }
    static genesis() {
        const timestamp = 0;
        const data = {};
        const lastHash = "-----";
        const nonce = 0;
        const hash = this.generateHash(timestamp, data, lastHash, nonce);

        return new this(timestamp, data, lastHash, nonce, hash);
    }
    static async mineBlock(lastBlock: Block, data: object) {
        const lastHash = lastBlock.hash;

        const { nonce, timestamp, hash } = await this.findNonce(data, lastHash);

        return new this(timestamp, data, lastHash, nonce, hash);
    }

    static async findNonce(
        data: object,
        lastHash: string
    ): Promise<{ nonce: number; timestamp: number; hash: string }> {
        return new Promise(resolve => {
            let timestamp: number, hash: string;
            let nonce = -1;
            do {
                timestamp = new Date().getTime();
                nonce++;

                hash = this.generateHash(timestamp, data, lastHash, nonce);
            } while (hash.substr(0, DIFFICULTY) !== "0".repeat(DIFFICULTY));

            return resolve({ timestamp, nonce, hash });
        });
    }

    static generateHash(
        timestamp: number,
        data: object,
        lastHash: string,
        nonce: number
    ): string {
        return SHA256(JSON.stringify({ ...arguments })).toString();
    }
    static blockHash(block: Block) {
        const { timestamp, data, lastHash, nonce } = block;
        return this.generateHash(timestamp, data, lastHash, nonce);
    }
}
