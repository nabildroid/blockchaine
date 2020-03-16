import * as React from "react";

import {bc} from "../main";

import Blockchain from "./sections/blockchain";
import Add from "./components/add";
import Status from "./components/status";

import { BlockTemplate } from "./components/block";

import "./style/style.css";
type State = {
    chain: BlockTemplate[];
}

class App extends React.Component<any, State>{
    state: State = {
        chain: []
    }
    constructor(props) {
        super(props);

        this.updateChain.bind(this);
    }
    componentDidMount(){
        this.updateChain();
    }
    updateChain() {
        let { chain } = bc;

        const blocks = chain.map((block,i): BlockTemplate => {
            const data: any = block.data;
            const { timestamp, hash } = block
            const state = i == 0 ? "Genesis" : "Valide"
            return {
                id: data.id,
                data: data.data,
                state,
                timestamp,
                hash
            }
        }).reverse();
        console.log(blocks);
        this.setState({chain:blocks});
    }
    render() {
        const { chain} = this.state;
        return (
            <div id="app">
                <h1 id="title">BlockChain</h1>
                <div>
                    <div id="main">
                        <Add updateChain={this.updateChain.bind(this)}/>
                        <Status updateChain={this.updateChain.bind(this)}/>
                    </div>
                    <Blockchain chain={chain} />
                </div>
            </div>

        );
    }
}

export default App;
