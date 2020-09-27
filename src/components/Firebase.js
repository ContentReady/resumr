import firebase from "firebase";
import "firebase/storage";
import "firebase/analytics";
import "firebase/performance";

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
export const analytics = firebase.analytics();

// Firebase Performance

const perf = firebase.performance();

window.perfMetrics.onFirstInputDelay(function (delay, evt) {
  analytics.logEvent("performance", {
    eventCategory: "Perf Metrics",
    eventAction: "first-input-delay",
    eventLabel: evt.type,
    // Event values must be an integer.
    eventValue: Math.round(delay),
    // Exclude this event from bounce rate calculations.
    nonInteraction: true,
  });
});

export default firebase;
export const auth = firebase.auth();
export const rtdb = firebase.database();
export const storage = firebase.storage();
