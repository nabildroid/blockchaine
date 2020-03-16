import * as React from "react"
export type BlockTemplate = {
    id: number;
    timestamp: number;
    state: string;
    data: object;
    hash: string;
};

class Block extends React.Component<BlockTemplate> {
    
    render() {
        const { data, hash, id, state, timestamp, } = this.props;
        return (
            <div className="item">
                <div className="info">
                    <p>{id}</p>
                    <p>{timestamp}</p>
                    <p><b>{state}</b></p>
                </div>
                <pre>{JSON.stringify(data)}</pre>
                <h4>#{hash.substr(0,25)}</h4>
            </div>
        )
    }
}

export default Block;