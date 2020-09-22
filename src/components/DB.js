import Dexie from "dexie";
import { v4 as uuidv4 } from "uuid";

const db = new Dexie("resumr-db");
db.version(1).stores({
  metadata: "contentId, title, type, size, lastModified, uploaded, lastPlayed",
  blobs: "contentId, blob",
});

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
  if (!db.isOpen()) {
    db.open();
  }
  db.metadata.put(contentDoc);
  db.blobs.put({
    contentId: contentId,
    blob: new Blob([file]),
  });
  if (db.isOpen()) {
    db.close();
  }
  return contentId;
};

const getMetadataById = async (contentId) => {
  if (!db.isOpen()) {
    db.open();
  }
  const doc = await db.metadata.get(contentId);
  if (db.isOpen()) {
    db.close();
  }
  return doc;
};

const getFilebyId = async (contentId) => {
  if (!db.isOpen()) {
    db.open();
  }
  return db.blobs.get(contentId);
};

const getContentList = async () => {
  if (!db.isOpen()) {
    db.open();
  }
  const keys = await db.metadata.orderBy("contentId").keys();
  const contentList = await keys.map(async (key) => {
    const doc = await getMetadataById(key);
    return doc;
  });
  if (db.isOpen()) {
    db.close();
  }
  return contentList;
};

const deleteContentById = (contentId) => {
  const deleteReq = db.blobs.where("contentId").equals(contentId).delete();
  return deleteReq;
};

// export default offline;
export { storeContent, getMetadataById, getFilebyId, getContentList };
