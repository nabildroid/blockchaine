import Node from "./node";

const mine = new Node();
mine.connectToNodes().then(() => {
    setInterval(() => {
        console.log("hello world");
        mine.send({ text: "hello webrtc" });
    }, 1000);
});
