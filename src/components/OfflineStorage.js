import Dexie from 'dexie';
import axios from 'axios';
import { storage } from './Firebase';

const db = new Dexie('offline-blobs');
db.version(1).stores({
  blobs: 'key, blob'
});

const offline = key => {
  // first try retrieving from indexeddb using dexie
  // if that fails, go upstream
  return db.blobs
    .get(key)
    .then(data => {
      return window.URL.createObjectURL(data.blob);
    })
    .catch(e => {
      console.error(e);
      const ref = storage.refFromURL(key);
      return ref.getDownloadURL().then(url => {
        return axios({
          url: url,
          method: 'GET',
          responseType: 'blob' // important
        }).then(response => {
          // store response.data using dexie
          db.blobs.put({
            key: key,
            blob: new Blob([response.data])
          });
          return window.URL.createObjectURL(new Blob([response.data]));
        });
      });
    });
};

const getCollection = () => {
  return db.blobs.orderBy('key').keys();
};

const deleteCollectionKey = key => {
  const deleteReq = db.blobs
    .where('key')
    .equals(key)
    .delete();

  return deleteReq;
};

export default offline;
export { getCollection, deleteCollectionKey };
