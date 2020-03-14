import Node from "./node";

const mine = new Node();
mine.connectToNodes().then(() => {
    setInterval(() => {
        console.log("Hello world");
        mine.send({ time: new Date().getTime() });
    }, 1000);
});
