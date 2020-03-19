import * as React from "react"

import { bc } from "../../main";
import { BlockTemplate } from "./block";

type State = {
    id: string;
    data: string;
    mining: boolean;
}
type Props = {
    addBlock: (block: BlockTemplate) => void
}

class Add extends React.Component<Props, State>{
    state: State = {
        id: "",
        data: "",
        mining: false
    }

    constructor(props) {
        super(props)
        this.add = this.add.bind(this);
    }

    add() {
        event.preventDefault();
        const { id, data } = this.state;
        if (id.length > 2 && data.length > 10) {
            this.setState({ mining: true });

            bc.addBlock({ id, data }).then((block) => {

                this.setState({
                    id: "",
                    data: "",
                    mining: false
                });
                const { hash, timestamp } = block;

                this.props.addBlock({
                    id,
                    timestamp,
                    validation: 0,
                    data,
                    hash
                });
            })
        }

    }
    render() {
        const { id, data, mining } = this.state;
        return (
            <div id="add">
                <h3>add new Block</h3>
                <form id="addblock">
                    <input type="text" onChange={e => this.setState({
                        id: e.target.value
                    })} value={id} disabled={mining} />
                    <textarea onChange={e => this.setState({
                        data: e.target.value
                    })} id="blockdata"
                        value={data} disabled={mining}
                    ></textarea>
                    <button onClick={this.add} disabled={mining}>
                        {!mining ? "Add!" : "Mining..."}
                    </button>
                </form>
            </div>
        )
    }
}

export default Add;