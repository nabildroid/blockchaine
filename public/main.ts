import Node from "./node";

const mine = new Node();
mine.connectToNodes().then(() => {
    setInterval(() => {
        mine.send({ text: "hello webrtc" + Math.random().toString() });
    }, 1000);
});
