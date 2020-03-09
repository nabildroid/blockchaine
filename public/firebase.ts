const firebase = require("firebase/app");
import "firebase/firestore";
firebase.initializeApp({
    apiKey: "AIzaSyA5V2B6ZsZ23lt2m3_4_lRGin0KlygiuJU",
    authDomain: "firetypo.firebaseapp.com",
    databaseURL: "https://firetypo.firebaseio.com",
    projectId: "firetypo",
    storageBucket: "firetypo.appspot.com",
    messagingSenderId: "664073406237",
    appId: "1:664073406237:web:a6aeaa653e79d94d6803f4"
});
export const db = firebase.firestore();

type userDoc = {
    id: number;
    signal: string;
    timestamp: any;
};
export const users = async (id: number): Promise<userDoc[]> => {
    const query = db.collection("users").orderBy("timestamp");
    let { docs } = await query.get();
    docs = docs.map(d => d.data());
    docs = docs.filter(d => d != id);

    return docs;
};

export const timestamp = () => firebase.firestore.FieldValue.serverTimestamp();
