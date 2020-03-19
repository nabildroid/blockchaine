import Block, { DIFFICULTY } from "../blockchain/block";
import { MINI_RATE } from "../blockchain/blockchain";

describe("Block", () => {
    let data, block, prevBlock;
    beforeEach(async () => {
        data = { name: "nabil", age: 20 };
        prevBlock = Block.genesis();
        block = await Block.mineBlock(prevBlock, data);
    });
    it("sets `data` to match the input", () => {
        expect(block.data).toEqual(data);
    });
    it("sets `lastHash` to the hash of last block", () => {
        expect(prevBlock.hash).toEqual(block.lastHash);
    });
    it("generates hash that matches the difficulty", () => {
        expect(block.hash.substr(0, block.difficulty)).toEqual(
            "0".repeat(block.difficulty)
        );
    });

    it("lowers the difficulty for slowly mined blocks", () => {
        const difficulty = block.difficulty - 1;
        expect(Block.adjustDifficulty(block, block.timestamp + MINI_RATE + 1))
            .toEqual( difficulty > -1 ? difficulty: 0 );
    });

    it("increase the difficulty for fast mined blocks", () => {
        const difficulty = block.difficulty + 1;
        expect(Block.adjustDifficulty(block, block.timestamp - MINI_RATE -1))
            .toEqual(difficulty);
    });

});
