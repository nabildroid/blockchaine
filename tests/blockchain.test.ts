import BlockChain from "../blockchain/blockchain";
import Block,{DIFFICULTY} from "../blockchain/block";

describe("BlockChain", () => {
    let bc, bc2, chainData;
    beforeEach(async () => {
        bc = new BlockChain();
        bc2 = new BlockChain();
        chainData = [
            Math.random().toString(),
            "second",
            "11",
            "abc",
            Math.random()
        ];
        await BlockChain.addChain(bc, chainData);
    });

    it("check if the first block is the Genises block ", () => {
        expect(bc.chain[0]).toEqual(Block.genesis());
    });

    it("adds new blocks",() => {
        chainData.forEach((data, i) => {
            expect(bc.chain[i + 1].data).toEqual(data);
        });
    });

    it("validates a valid chain", () => {
        expect(BlockChain.validate(bc.chain)).toBe(true);
    });
    it("invalidates a chain with one corrupted data", () => {
        bc.chain[1].data = { msg: "corrupt" };

        expect(BlockChain.validate(bc.chain)).toBe(false);
    });
    it("invalidates a chain that doesn't start with the Genises Block", () => {
        bc.chain[0] = new Block(87, {}, "dff", 0,DIFFICULTY ,"ddff");

        expect(BlockChain.validate(bc.chain)).toBe(false);
    });

    it("replace current chain with another valid chain that is the longest", async () => {
        chainData.push("yey another amazing data");
        await BlockChain.addChain(bc2, chainData);

        bc.replaceChain(bc2.chain);
        expect(bc.chain).toEqual(bc2.chain);
    });
    it("does not replace current chain with another valid chain that is the longest", async () => {
        await BlockChain.addChain(bc2, chainData);
        await bc.addBlock(["yey another amazing data"]);

        bc.replaceChain(bc2.chain);
        expect(bc.chain).not.toEqual(bc2.chain);
    });

});
