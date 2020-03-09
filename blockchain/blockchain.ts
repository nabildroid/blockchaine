import Block from "./block";

export default class BlockChain {
    chain: Block[];
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock(data: object) {
        const lastBlock = this.chain[this.chain.length - 1];
        const block = Block.mineBlock(lastBlock, data);
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
        for (let i = 0; i < chain.length - 1; i++) {
            const block = chain[i];
            if (
                block.hash != chain[i + 1].lastHash ||
                Block.blockHash(block) != block.hash
            )
                return false;
        }
        return true;
    }
}
