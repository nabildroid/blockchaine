const SimplePeer = require("simple-peer");

type callback = (data: Object, id?: number) => void;
class P2P {
    private peer;
    private signal: string;
    linked: boolean;
    _receive: callback;

    id: number;
    index: number; // auto generated
    constructor(id: number, init: boolean = false) {
        // init class
        this.peer = new SimplePeer({
            initiator: init,
            trickle: false,
            objectMode: true
        });
        this.linked = false;
        this.id = id;
        this.index = Math.floor(Math.random() * 100000);

        // init peer life cycles
        this.peer.on("signal", s => (this.signal = JSON.stringify(s)));
        this.peer.on("connect", () => {
            this.linked = true;
            this.conneced();
        });
        this.peer.on("data", data => {
            if (this._receive) this._receive(JSON.parse(data), this.id);
        });
        this.peer.on("close", () => (this.linked = false));
        this.peer.on("error", this.error);
    }
    async getSignal(): Promise<string> {
        return new Promise((resolve, reject) => {
            const checker = setInterval(() => {
                if (this.signal) {
                    clearInterval(checker);
                    return resolve(this.signal);
                }
            }, 50);
        });
    }
    setSignal(data: string) {
        this.peer.signal(JSON.parse(data));
    }
    send(data: Object) {
        if (this.linked) {
            this.peer.send(JSON.stringify(data));
            return true;
        } else return false;
    }
    receive(fct: callback) {
        this._receive = fct;
    }
    conneced() {
        console.log(`${this.id} is connected`);
    }
    destroy() {
        this.peer.destroy();
    }
    error(e: Error) {
        console.error(e);
    }
    static create(id: number, receive: callback) {
        const peer = new this(id);
        peer.receive(receive);
        return peer;
    }
}

export default P2P;
