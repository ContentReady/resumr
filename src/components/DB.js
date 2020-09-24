import Dexie from "dexie";
import { v4 as uuidv4 } from "uuid";
import { storage, rtdb, auth } from "./Firebase";
import axios from "axios";

const db = new Dexie("resumr-db");
db.version(1).stores({
  metadata: "contentId, title, type, size, lastModified, uploaded, lastPlayed",
  blobs: "contentId, blob",
});

const updateMetadata = async (contentId, changes) => {
  // if (!db.isOpen()) {
  //   db.open();
  // }
  const promise = await db.metadata.update(contentId, changes);
  if (auth.currentUser) {
    rtdb
      .ref(`users/${auth.currentUser.uid}/content/${contentId}`)
      .update(changes);
  }
  // if (db.isOpen()) {
  //   //db.close();
  // }
  return promise;
};

const storeContent = async (file) => {
  const contentId = uuidv4();
  const contentDoc = {
    contentId: contentId,
    title: file.name,
    type: file.type,
    size: file.size,
    lastModified: file.lastModified,
    uploaded: new Date(),
    lastPlayed: new Date(),
  };
  // if (!db.isOpen()) {
  //   db.open();
  // }
  db.metadata.put(contentDoc);
  db.blobs.put({
    contentId: contentId,
    blob: new Blob([file]),
  });
  if (auth.currentUser) {
    console.log("storing on Firebase too");
    // const ext = file.name.split(".").pop();
    rtdb
      .ref(`users/${auth.currentUser.uid}/content/${contentId}`)
      .set(contentDoc);
    storage
      .ref()
      .child(`${auth.currentUser.uid}/uploads/${contentId}`)
      .put(file);
  }

  // if (db.isOpen()) {
  //   //db.close();
  // }
  return contentId;
};

const getMetadataById = async (contentId) => {
  // if (!db.isOpen()) {
  //   db.open();
  // }
  try {
    const doc = await db.metadata.get(contentId);
    // if (db.isOpen()) {
    //   //db.close();
    // }
    if (!doc)
      throw Error("Content not found locally. Will retrieve from remote DB.");
    return doc;
  } catch (e) {
    if (auth.currentUser) {
      return rtdb
        .ref(`users/${auth.currentUser.uid}/content/${contentId}`)
        .once("value")
        .then((doc) => {
          const data = doc.val();
          db.metadata.put(data);
          return data;
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }
};

const getFilebyId = async (contentId) => {
  // if (!db.isOpen()) {
  //   db.open();
  // }
  try {
    const data = await db.blobs.get(contentId);
    // if (db.isOpen()) {
    //   //db.close();
    // }
    if (!data.blob)
      throw Error("File not found locally. Will retrieve from remote storage.");
    return data.blob;
  } catch (e) {
    if (auth.currentUser) {
      return storage
        .ref()
        .child(`${auth.currentUser.uid}/uploads/${contentId}`)
        .getDownloadURL()
        .then((url) => {
          return axios({
            url: url,
            method: "GET",
            responseType: "blob", // important
          }).then((response) => {
            // store response.data using dexie
            const blob = new Blob([response.data]);
            db.blobs.put({
              contentId: contentId,
              blob: blob,
            });
            return blob;
          });
        });
    }
  }
};

const syncContent = () => {
  // if (!db.isOpen()) {
  //   db.open();
  // }
  return rtdb
    .ref(`users/${auth.currentUser.uid}/content`)
    .orderByChild("lastPlayed")
    .once("value")
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const obj = doc.val();
        obj["contentId"] = doc.key;
        db.metadata.put(obj);
      });
      // if (db.isOpen()) {
      //   //db.close();
      // }
    })
    .catch((e) => {
      console.error(e);
    });
};

const getContentList = async () => {
  // if (!db.isOpen()) {
  //   db.open();
  // }
  if (auth.currentUser) {
    syncContent();
  }
  const keys = await db.metadata.orderBy("contentId").keys();
  const contentList = await keys.map(async (key) => {
    const doc = await getMetadataById(key);
    return doc;
  });
  // if (db.isOpen()) {
  //   //db.close();
  // }
  return contentList;
};

const deleteContentById = (contentId) => {
  // if (!db.isOpen()) {
  //   db.open();
  // }
  try {
    if (auth.currentUser) {
      rtdb.ref(`users/${auth.currentUser.uid}/content/${contentId}`).set({});
      storage
        .ref()
        .child(`${auth.currentUser.uid}/uploads/${contentId}`)
        .delete();
    }
  } catch (e) {
    console.error(e);
  }

  return db.blobs.delete(contentId).then(() => {
    db.metadata.delete(contentId);
  });
};

export {
  updateMetadata,
  storeContent,
  getMetadataById,
  getFilebyId,
  getContentList,
  deleteContentById,
};
