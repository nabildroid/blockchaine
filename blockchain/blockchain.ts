import Block from "./block";

export const MINI_RATE = 1000;
export default class BlockChain {
    chain: Block[];
    constructor() {
        this.chain = [Block.genesis()];
    }

    async addBlock(data: object) {
        const lastBlock = this.chain[this.chain.length - 1];
        let start = new Date().getTime();
        const block = await Block.mineBlock(lastBlock, data);
        console.log(
            `mining block took :${Math.round(
                (block.timestamp - start) / 1000
             )}s`
        );
        this.chain.push(block);

        return block;
    }
    replaceChain(chain: Block[]) {
        if (this.chain.length >= chain.length) return false;
        else if (!BlockChain.validate(chain)) return false;

        this.chain = chain;
        return true;
    }

    static validate(chain: Block[]) {
        if (chain[0].stringify() != Block.genesis().stringify()) return false;
        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            const prev = chain[i - 1];
            // verify matching hashes
            if (
                prev.hash != block.lastHash ||
                Block.blockHash(block) !== block.hash
            )
                return false;

            // // vefiry matching difficuly
            const timestampDifference = block.timestamp - prev.timestamp;
            const difficulty =
                prev.difficulty + (timestampDifference >= MINI_RATE ? -1 : 1);

            if (
                difficulty !== block.difficulty
                ||
                block.hash.substr(0, difficulty) !== "0".repeat(difficulty)
            )
                return false;
        }
        return true;
    }
    static async addChain(bc: BlockChain, chain: object[]) {
        async function* addGenerator() {
            for (const block of chain) {
                yield await bc.addBlock(block);
            }
        }
        const add = addGenerator();
        while (!(await add.next()).done);
    }
}
