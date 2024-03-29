import firebase from "firebase";
import "firebase/storage";
import "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDP4TDL30TMGcrWZm8SSKp1Xi0RP4EF6MU",
  authDomain: "resumr-8540b.firebaseapp.com",
  databaseURL: "https://resumr-8540b.firebaseio.com",
  projectId: "resumr-8540b",
  storageBucket: "resumr-8540b.appspot.com",
  messagingSenderId: "304697870266",
  appId: "1:304697870266:web:fe407168ca799d420bff83",
  measurementId: "G-LYQ5X523B4",
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const fbCore = firebase;
export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();

const settings = {
  cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
};
db.settings(settings);
db.enablePersistence();
