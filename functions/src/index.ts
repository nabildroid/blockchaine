import * as functions from "firebase-functions";
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firestore);
const db = admin.firestore();
import BlockChain from "../../blockchain/blockchain";

const bc = new BlockChain();

export const blocks = functions.https.onRequest((request, response) => {
    response.type("application/json");
    response.send(bc.chain);
});
export const mine = functions.https.onRequest((req, res) => {
    if (req.method == "POST") {
        const { data } = req.body;
        bc.addBlock(data);
        res.redirect("./blocks");
    } else {
        res.status(501);
        res.send("only POST requests allowed");
    }
});
export const clearUsers = functions.https.onRequest(async (r, res) => {
    const { docs } = await db.collection("users").get();
    docs.forEach(async (doc: any) => {
        await doc.ref.delete();
    });
    res.send(`deleted: ${docs.length} user`);
});
