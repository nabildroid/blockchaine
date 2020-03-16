import * as React from "react"

import {network} from "../../main";

import Block,{BlockTemplate} from "../components/block";
class Blockchain extends React.Component<{chain:BlockTemplate[]}>{
    constructor(props){
        super(props);
    }
    push(){
        console.log("Pushing ...")
        network.push();
    }
    render(){
        const {chain} = this.props;
        return (
            <div id="blockchain">
                <div className="info">
                    <h2>blockchain</h2>
                    <button id="push" onClick={this.push}>
                        Push
                    </button>
                </div>
                <div id="blockitems">
                    {
                        chain.map(data=>(
                            <Block {...data} key={data.timestamp} />
                        ))
                    }
                </div>
            </div>
        )
    }
}

export default Blockchain;