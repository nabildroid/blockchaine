import { db, timestamp } from "./firebase";

export type BroadcastType = {
    ref?: any;
    id: number;
    index: number;
    signal: string;
    timestamp: any;
};
export type ListenerType = BroadcastType & {
    channel: number;
};

export const broadcasters = async (id: number): Promise<BroadcastType[]> => {
    const query = db.collection("broadcast").orderBy("timestamp");
    let { docs } = await query.get();
    docs = docs.map(d => ({ ref: d.ref, ...d.data() }));
    docs = docs.filter(d => d != id);

    return docs;
};
export const broadcast = (id: number, index: number, signal: string) => {
    db.collection("broadcast").add({
        id,
        index,
        signal,
        timestamp: timestamp()
    });
};
export const listeners = (
    id: number,
    change: (docs: ListenerType[]) => void
): (() => void) => {
    console.log("listener to active peers in listener collection");
    const query = db
        .collection("listener")
        .where("channel", "==", id)
        .onSnapshot(snapshot => {
            console.log("new listeners Snapshot");
            // if(snapshot.metadata.hasPendingWrites)
            const docs: ListenerType[] = [];

            snapshot.docChanges().forEach(change => {
                console.log(`one Listener has been ${change.type}`);
                if (change.type === "added") {
                    const { doc } = change;
                    docs.push({
                        ref: doc.ref,
                        ...doc.data()
                    });
                }
            });

            change(docs);
        });
    return () => query();
};
export const listen = (
    id: number,
    index: number,
    signal: string,
    broadcast: BroadcastType
) => {
    console.log("going to listen");
    console.log(signal);
    db.collection("listener").add({
        id,
        index,
        signal,
        channel: broadcast.id,
        timestamp: timestamp()
    });
};
