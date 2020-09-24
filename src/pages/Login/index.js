import { Link } from "@reach/router";
import React, { useState, useEffect } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase, { auth } from "../../components/Firebase";
import { navigate } from "@reach/router";

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "popup",
  autoUpgradeAnonymousUsers: true,
  signInSuccessUrl: "/",
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    signInFailure: (error) => {
      console.log("signInFailure");
      if (error.code !== "firebaseui/anonymous-upgrade-merge-conflict") {
        return Promise.resolve();
      }
      const cred = error.credential;
      return firebase.auth().signInWithCredential(cred);
    },
  },
};

export default function Login() {
  const [user, setUser] = useState();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      }
    });
  }, []);
  if (user && user.email) {
    navigate("/");
  }
  return (
    <>
      {user && user.email ? (
        <p>
          Already Logged In. <Link to="/">Return to home page.</Link>
        </p>
      ) : (
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
      )}
    </>
  );
}
