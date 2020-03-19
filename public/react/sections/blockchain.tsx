import * as React from "react"

import { network } from "../../main";

import Block, { BlockTemplate } from "../components/block";
type Props =  { blocks: readonly BlockTemplate[] }
class Blockchain extends React.Component<Props>{

    push() {
        console.log("Pushing ...")
        network.push();
    }
    render() {
        const {blocks} = this.props
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
                        (blocks || []).concat().reverse().map(data => (
                            <Block {...data} key={data.timestamp} />
                        ))
                    }
                </div>
            </div>
        )
    }
}

export default Blockchain;