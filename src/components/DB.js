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
  const promise = await db.metadata.update(contentId, changes);
  if (auth.currentUser) {
    rtdb
      .ref(`users/${auth.currentUser.uid}/content/${contentId}`)
      .update(changes);
  }
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
  return contentId;
};

const getMetadataById = async (contentId) => {
  try {
    const doc = await db.metadata.get(contentId);
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
  try {
    const data = await db.blobs.get(contentId);
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
  let localContentIds = [];
  let remoteContentIds = [];
  let deletedContentIds = [];
  let shouldReload = false;
  return db.metadata
    .orderBy("contentId")
    .keys()
    .then((contentIds) => {
      localContentIds = contentIds;
      // sync from remote to local
      rtdb
        .ref(`users/${auth.currentUser.uid}/content`)
        .orderByChild("contentId")
        .once("value")
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const obj = doc.val();
            const contentId = doc.key;
            if (obj.isDeleted) {
              deletedContentIds.push(contentId);
            }
            remoteContentIds.push(contentId);
            obj["contentId"] = contentId;
            if (!localContentIds.includes(contentId) && !obj.isDeleted) {
              // Add to indexedDB
              db.metadata.put(obj);
              shouldReload = true;
            }
          });
        })
        .then(() => {
          // sync from local to remote
          // console.log(localContentIds, remoteContentIds);
          Promise.all(
            localContentIds.map((contentId) => {
              if (deletedContentIds.includes(contentId)) {
                console.log("Should delete:", contentId);
                deleteContentById(contentId);
                shouldReload = true;
              } else if (!remoteContentIds.includes(contentId)) {
                // This will be the case if user signs up after a while or uploads content while signed out
                console.log("Should upload:", contentId);
                return db.blobs.get(contentId).then((data) => {
                  if (data && data.blob) {
                    const blob = data.blob;
                    const file = new File([blob], contentId);
                    storage
                      .ref()
                      .child(`${auth.currentUser.uid}/uploads/${contentId}`)
                      .put(file)
                      .then(() => {
                        console.log("Uploaded:", contentId);
                        return db.metadata.get(contentId).then((contentDoc) => {
                          return rtdb
                            .ref(
                              `users/${auth.currentUser.uid}/content/${contentId}`
                            )
                            .set(contentDoc);
                        });
                      });
                  }
                });
              } else {
                // Exists in both remote and local.
                // Should update from remote to get latest position and title etc.
                // console.log(contentId);
                return rtdb
                  .ref(`users/${auth.currentUser.uid}/content/${contentId}`)
                  .once("value")
                  .then((doc) => {
                    const data = doc.val();
                    return db.metadata.put(data);
                  })
                  .catch((e) => {
                    console.error(e);
                  });
              }
              return true;
            })
          ).then(() => {
            // if (shouldReload) {
            //   window.location.reload();
            // }
            window.location.reload();
          });
        });
    })
    .catch((e) => {
      console.error(e);
    });
};

const getContentList = async () => {
  const keys = await db.metadata.orderBy("contentId").keys();
  const contentList = await keys.map(async (key) => {
    const doc = await getMetadataById(key);
    return doc;
  });
  return contentList;
};

// const subscribeToRemoteDB = () => {
//   if (!auth.currentUser) {
//     return false;
//   }
//   rtdb
//     .ref(`users/${auth.currentUser.uid}/content`)
//     .orderByChild("contentId")
//     .on("value")
//     .then((querySnapshot) => {
//       querySnapshot.forEach((doc) => {
//         const obj = doc.val();
//         const contentId = doc.key;
//         console.log(obj, contentId);
//       });
//     })
//     .catch((e) => {
//       console.error(e);
//     });
// };

const deleteContentById = (contentId) => {
  try {
    if (auth.currentUser) {
      rtdb
        .ref(`users/${auth.currentUser.uid}/content/${contentId}`)
        .update({ isDeleted: true })
        .then(() => {
          storage
            .ref()
            .child(`${auth.currentUser.uid}/uploads/${contentId}`)
            .delete()
            .catch((e) => {
              console.error(e);
            });
        })
        .catch((e) => {
          console.error(e);
        });
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
  syncContent,
};
