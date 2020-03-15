import Block, { DIFFICULTY } from "../blockchain/block";

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
    it(`generates hash that matches the difficulty =${DIFFICULTY}`, () => {
        expect(block.hash.substr(0, DIFFICULTY)).toEqual(
            "0".repeat(DIFFICULTY)
        );
    });
});
