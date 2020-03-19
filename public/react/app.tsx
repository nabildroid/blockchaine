import * as React from "react";

import Block, { BlockType } from "../../blockchain/block";
import { bc } from "../main";

import Blockchain from "./sections/blockchain";
import Add from "./components/add";
import Status from "./components/status";

import { BlockTemplate } from "./components/block";

import "./style/style.css";
type State = {
    chain: BlockTemplate[];
}

type StoredBlock = BlockType & {
    validation: number;
    data: {
        id: string;
        data: string;
    }
}

class App extends React.Component<any, State>{
    state: State = {
        chain: []
    }

    componentDidMount() {
        this.loadChain();
    }

    loadChain() {
        const storage = localStorage.getItem("chain");
        const chain: StoredBlock[] = JSON.parse(storage) || [];



        const agree = bc.replaceChain(chain.map(block => {
            //todo is this `block` is a real block or jsut contain Block proprieties
            const { timestamp, data, lastHash, nonce, difficulty, hash } = block;
            return new Block(timestamp, data, lastHash, nonce, difficulty, hash)
        }));

        const validatedChain: BlockTemplate[] = [];
        if (chain || agree) {
            chain.forEach((block: StoredBlock, i) => {
                validatedChain.push({
                    id: !i ? "Genesis" : block.data.id,
                    timestamp: block.timestamp,
                    validation: !i ? i : block.validation,
                    data: block.data.data,
                    hash: block.hash
                })
            });

            return new Promise(res =>
                this.setState({ chain: validatedChain }, res)
            )

        } else return this.reloadChain();



    }

    saveChain() {
        const BCchain = bc.chain;
        const { chain } = this.state;

        const storage: StoredBlock[] = BCchain.map((block, i) => {
            const { timestamp, data, lastHash, nonce, difficulty, hash } = block;
            const newBlock: StoredBlock = {
                timestamp,
                data: {
                    id: (data as { id: string }).id,
                    data: (data as { data: string }).data
                },
                validation: 0,
                lastHash, nonce, difficulty, hash
            };

            if (chain[i] && chain[i].hash == block.hash)
                newBlock.validation = chain[i].validation;
            return newBlock;
        })

        localStorage.setItem("chain", JSON.stringify(storage));
    }

    async reloadChain() {
        this.saveChain();
        return await this.loadChain();
    }

    addBlock(block: BlockTemplate) {
        const { chain } = this.state;
        chain.push(block);
        this.setState({ chain }, () =>
            this.saveChain()
        )
    }

    async validateChain(validation: boolean) {
        // get current state (not contain the new blocks)

        let { chain } = this.state;

        let newChain: BlockTemplate[];

        if (!validation) {
            newChain = chain.map(block => {
                block.validation--;
                return block;
            })
        } else {

            await this.reloadChain();
            newChain = this.state.chain;

            newChain = newChain.map((block, i) => {
                if (chain[i] && chain[i].hash === block.hash)
                    block.validation++;
                return block
            });
        }
        this.setState(
            { chain: newChain },
            () => this.saveChain()
        );
    }

    render() {
        const { chain } = this.state;

        return (
            <div id="app">
                <h1 id="title">BlockChain</h1>
                <div>
                    <div id="main">
                        <Add addBlock={this.addBlock.bind(this)} />
                        <Status validate={this.validateChain.bind(this)} />
                    </div>
                    <Blockchain blocks={chain} />
                </div>
            </div>
        );
    }
}

export default App;
