import * as React from "react"
import { network } from "../../main"

type State = {
    peers: number;
    status: string;
}
type Props = {
    updateChain: () => void
}
class Status extends React.Component<Props, State> {
    state: State = {
        peers: 0,
        status: "init"
    }
    componentDidMount() {
        network.on("connected", () =>
            this.setState({ status: "connected" })
        )

        network.on("peerJoined", () => {
            const { peers } = this.state;
            this.setState({ peers: peers + 1 });
        });

        network.on("receive", (agree: boolean) => {
            const { status } = this.state;

            if (!status.startsWith("BC")) {
                this.setState({
                    status: "BC received"
                });
                setTimeout(() => {
                    this.setState({
                        status: `BC ${agree ? "accepted" : "rejected"}!`
                    });

                    if (agree) this.props.updateChain()

                    setTimeout(() =>
                        this.setState({ status })
                        , 2000)
                }, 3000);
            }
        })
    }

    render() {
        const { status, peers } = this.state;
        return (
            <div className="info">
                <div>
                    <b>status</b>
                    <p id="status">{status}</p>
                </div>
                <div>
                    <b>peers</b>
                    <p id="peers">{peers}</p>
                </div>
            </div>
        )
    }
}

export default Status;