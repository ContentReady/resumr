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

// if (!firebase.apps.length) {
//   firebase.initializeApp({});
// }

// if (typeof window !== "undefined" && !firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
//   if ("measurementId" in firebaseConfig) firebase.analytics();
// }

try {
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  firebase
    .firestore()
    .enablePersistence()
    .catch(function (err) {
      if (err.code === "failed-precondition") {
        // Multiple tabs open, persistence can only be enabled
        // in one tab at a a time.
        // ...
        console.error(err);
      } else if (err.code === "unimplemented") {
        // The current browser does not support all of the
        // features required to enable persistence
        // ...
        console.error(err);
      }
    });
} catch (err) {
  if (!/already exists/.test(err.message)) {
    console.error("Firebase initialization error", err.stack);
  }
}

export const fbCore = firebase;

export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();
