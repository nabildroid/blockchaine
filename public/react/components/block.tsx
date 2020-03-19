import * as React from "react"
import TimeAgo from "../utils/timeago";


export type BlockTemplate = {
    id: string;
    timestamp: number;
    validation: number;
    data: string;
    hash: string;
};

type State = {
    state: "valide" | "local" | "rejected";
    created: number;
}
class Block extends React.Component<BlockTemplate> {
    state: State = {
        state: "local",
        created: 0
    }
    componentDidMount() {
        const { timestamp } = this.props;
        if (timestamp)
            setInterval(() =>
                this.setState({ created: TimeAgo(timestamp) })
                , 60 * 1000
            );
    }
    static getDerivedStateFromProps(props) {
        const { validation, timestamp } = props;
        let state = validation > 0 ? "Valide" :
            (validation == 0 ? "local" : "rejected");

        return {
            state,
            created: !timestamp || TimeAgo(timestamp)
        }
    }

    render() {
        const { data, hash, id } = this.props;
        const { state, created } = this.state;
        return (
            <div className="item">
                <div className="info">
                    <p>{id}</p>
                    <p>{created}</p>
                    <p><b>{state}</b></p>
                </div>
                <pre>{data}</pre>
                <h4>#{hash.substr(0, 25)}...</h4>
            </div>
        )
    }
}

export default Block;