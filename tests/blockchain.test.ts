import BlockChain from "../blockchain/blockchain";
import Block from "../blockchain/block";
describe("BlockChain", () => {
    let bc: BlockChain, bc2: BlockChain, chainData;
    beforeEach(() => {
        bc = new BlockChain();
        bc2 = new BlockChain();
        chainData = [
            Math.random().toString(),
            "second",
            "11",
            "abc",
            Math.random()
        ];
    });

    it("check if the first block is the Genises block ", () => {
        expect(bc.chain[0]).toEqual(Block.genesis());
    });

    it("adds new blocks", () => {
        chainData.forEach((data, i) => {
            bc.addBlock({ data });
            expect(bc.chain[i + 1].data).toEqual({ data });
        });
    });

    it("validates a valid chain", () => {
        chainData.forEach(data => bc.addBlock({ data }));
        expect(BlockChain.validate(bc.chain)).toBe(true);
    });
    it("invalidates a chain with one corrupted data", () => {
        chainData.forEach(data => bc.addBlock({ data }));
        bc.chain[1].data = { msg: "corrupt" };

        expect(BlockChain.validate(bc.chain)).toBe(false);
    });
    it("invalidates a chain that doesn't start with the Genises Block", () => {
        bc.chain[0] = new Block(87, {}, "dff", "ddff");
        chainData.forEach(data => bc.addBlock({ data }));

        expect(BlockChain.validate(bc.chain)).toBe(false);
    });

    it("replace current chain with another valid chain that is the longest", () => {
        chainData.forEach(data => bc.addBlock({ data }));
        chainData.push("yey another amazing data");
        chainData.forEach(data => bc2.addBlock({ data }));
        bc.replaceChain(bc2.chain);

        expect(bc.chain).toEqual(bc2.chain);
    });
    it("does not replace current chain with another valid chain that is the longest", () => {
        chainData.forEach(data => bc2.addBlock({ data }));
        chainData.push("yey another amazing data");
        chainData.forEach(data => bc.addBlock({ data }));
        bc.replaceChain(bc2.chain);

        expect(bc.chain).not.toEqual(bc2.chain);
    });
});
