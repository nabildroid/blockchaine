import Network from "./network";
import BlockChain from "../blockchain/blockchain";
import { timestamp } from "./p2p/firebase";

const bc = new BlockChain();
const network = new Network(bc);

network.connectToNodes();

window.addEventListener("DOMContentLoaded", () => {
    const elmsId = [
        "push",
        "addblock",
        "blockdata",
        "status",
        "peers",
        "blockitems"
    ];
    const elms: any = {};
    elmsId.map(e => {
        elms[e] = document.getElementById(e);
    });

    // init status
    elms.status.innerText = "init";
    elms.peers.innerText = "0";

    network.on("connected", () => {
        elms.status.innerText = "connected";
    });

    network.on("receive", agree => {
        const { status } = elms;
        const oldStatus = status.innerText;
        status.innerText = "BC recieved";
        setTimeout(() => {
            status.innerText = agree ? "accepted" : "rejected";
            setTimeout(() => {
                status.innerText = oldStatus;
            }, 3000);
        }, 2000);
        updateBlockhainList();
    });

    network.on("peerJoined", () => {
        const length = +elms.peers.innerText;
        elms.peers.innerText = (length + 1).toString();
    });

    // add new block
    elms.addblock.addEventListener("submit", () => {
        event.preventDefault();
        const data = JSON.parse(elms.blockdata.value);
        elms.blockdata.value = "";
        bc.addBlock(data);
        updateBlockhainList();
    });

    //push blockchain
    elms.push.addEventListener("click", () => {
        network.push();
    });

    // update blockchain section
    const updateBlockhainList = () => {
        const items: HTMLElement[] = Array.from(
            elms.blockitems.querySelectorAll(".item")
        );

        bc.chain.slice(1).forEach(block => {
            const exist = items.find(item => {
                const hash = item.getAttribute("id");
                return hash == block.hash;
            });
            if (!exist) addBlock(block);
        });
    };
    const addBlock = ({ data, timestamp, hash }) => {
        const html = `
            <div class="info">
                <p>${data.id}</p>
                <p>${timestamp}</p>
                <p><b>Valide</b></p>
            </div>
            <pre>${JSON.stringify(data.data)}</pre>
            <h4>${hash}</h4>
        `;
        const item = document.createElement("div");
        item.classList.add("item");
        item.setAttribute("id", hash);
        item.innerHTML = html;
        elms.blockitems.prepend(item);
    };
});
