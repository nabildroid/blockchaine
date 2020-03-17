const SHA256 = require("crypto-js/sha256");

export const DIFFICULTY = 2;
import { MINI_RATE } from "./blockchain";
export type BlockType = {
    data: object;
    timestamp: number;
    lastHash: string;
    nonce: number;
    difficulty: number;
    hash: string;
};

export default class Block {
    timestamp: number;
    lastHash: string;
    data: object;
    nonce: number;
    difficulty: number;
    hash: string;
    constructor(
        timestamp: number,
        data: object,
        lastHash: string,
        nonce: number,
        difficulty: number,
        hash: string
    ) {
        this.timestamp = timestamp;
        this.data = data;
        this.lastHash = lastHash;
        this.nonce = nonce;
        this.difficulty = difficulty;
        this.hash = hash;
    }

    toString() {
        return `Block -- 
            Timestamp : ${this.timestamp}
            Data      : ${JSON.stringify(this.data)}
            Last Hash : ${this.lastHash.substr(0, 10)}...
            nonce     : ${this.nonce}
            difficulty: ${this.difficulty}
            Hash      : ${this.hash.substr(0, 10)}...
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
        const difficulty = DIFFICULTY;
        const hash = this.generateHash(
            timestamp,
            data,
            lastHash,
            nonce,
            difficulty
        );

        return new this(timestamp, data, lastHash, nonce, difficulty, hash);
    }

    static mineBlock(lastBlock: Block, data: object): Promise<Block> {
        const lastHash = lastBlock.hash;

        return new Promise(res => {
            let nonce = -1;
            const i = setInterval(() => {
                const timestamp = Date.now();
                nonce++;

                const difficulty = this.adjustDifficulty(lastBlock, timestamp);

                const hash = this.generateHash(
                    timestamp,
                    data,
                    lastHash,
                    nonce,
                    difficulty
                );
                const done =
                    hash.substr(0, difficulty) === "0".repeat(difficulty);

                if (done) {
                    clearInterval(i);
                    const newBlock = new this(
                        timestamp,
                        data,
                        lastHash,
                        nonce,
                        difficulty,
                        hash
                    );

                    res(newBlock);
                }
            });
        });
    }

    static adjustDifficulty(lastBlock: Block, currentTime: number) {
        const { difficulty } = lastBlock;

        const difference = currentTime - lastBlock.timestamp ;
        const adjust = difference >= MINI_RATE ? -1 : 1;

        if (difficulty + adjust >= 0) return difficulty + adjust;
        else return 0;
    }

    static generateHash(
        timestamp: number,
        data: object,
        lastHash: string,
        nonce: number,
        difficulty: number
    ): string {
        return SHA256(JSON.stringify({ ...arguments })).toString();
    }
    static blockHash(block: Block) {
        const { timestamp, data, lastHash, nonce, difficulty } = block;
        return this.generateHash(timestamp, data, lastHash, nonce, difficulty);
    }
}
