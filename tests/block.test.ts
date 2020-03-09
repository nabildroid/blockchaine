import Block from "../blockchain/block";

describe("Block", () => {
    let data, block, prevBlock;
    beforeEach(() => {
        data = { name: "nabil", age: 20 };
        prevBlock = Block.genesis();
        block = Block.mineBlock(prevBlock, data);
    });
    it("sets `data` to match the input", () => {
        expect(block.data).toEqual(data);
    });
    it("sets `lastHash` to the hash of last block", () => {
        expect(prevBlock.hash).toEqual(block.lastHash);
    });
});
