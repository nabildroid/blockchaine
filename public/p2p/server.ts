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

/**
 * fetch all broadcaster available in network
 * @param id exclude broadcaster of id = `id`
 */
export const broadcasters = async (id: number): Promise<BroadcastType[]> => {
    //fetch broadcast documents
    const ref = db.collection("broadcast");
    let queries = [ref.where("id", ">", id), ref.where("id", "<", id)];
    queries = await Promise.all(queries.map(q => q.get()));

    //extract docs array from each query
    let docs = [];
    queries.forEach(q => docs.push(...q.docs));
    console.log(docs);

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
    answar: string,
    broadcast: BroadcastType
) => {
    console.log("going to listen");
    console.log(answar);
    db.collection("listener").add({
        id,
        signal: answar,
        channel: broadcast.id,
        index: broadcast.index,
        timestamp: timestamp()
    });
};
