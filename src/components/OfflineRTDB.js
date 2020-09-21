import Dexie from "dexie";
import { auth, rtdb } from "./Firebase";

const db = new Dexie("offline-rtdb");
db.version(1).stores({
  docs: "key, doc",
});

const offlineDoc = (key) => {
  // first try retrieving from indexeddb using dexie
  // if that fails, go upstream
  return db.docs
    .get(key)
    .then((data) => {
      if (!data) throw Error("Not found locally!");
      return data.doc;
    })
    .catch((e) => {
      return rtdb
        .ref(`users/${auth.currentUser.uid}/content/${key}`)
        .once("value")
        .then((doc) => {
          const data = doc.val();
          console.log(data);
          db.docs.put({
            key: key,
            doc: data,
          });
          return data;
        })
        .catch((e) => {
          console.error(e);
        });
    });
};

const offlineList = () => {
  // first try retrieving from indexeddb using dexie
  // if that fails, go upstream
  return db.docs
    .orderBy("key")
    .keys()
    .then((keys) => {
      // console.log(keys);
      if (!keys.length) throw Error("Empty list!");
      const contentArray = [];
      keys.map((key) => {
        return contentArray.push(offlineDoc(key));
      });
      return contentArray;
    })
    .catch((e) => {
      console.error(e);
      rtdb
        .ref(`users/${auth.currentUser.uid}/content`)
        .orderByChild("lastPlayed")
        .once("value")
        .then((querySnapshot) => {
          const contentArray = [];
          querySnapshot.forEach((doc) => {
            const obj = doc.val();
            obj["id"] = doc.key;
            contentArray.push(obj);
            db.docs.put({
              key: doc.key,
              doc: obj,
            });
          });
          return contentArray;
        })
        .catch((e) => {
          console.error(e);
        });
    });
};

const getCollection = () => {
  return db.docs.orderBy("key").keys();
};

export default offlineDoc;
export { getCollection, offlineList };
