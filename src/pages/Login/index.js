import { Link } from "@reach/router";
import React, { useState, useEffect } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { fbCore, auth } from "../../components/Firebase";

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "popup",
  autoUpgradeAnonymousUsers: true,
  signInSuccessUrl: "/",
  signInOptions: [fbCore.auth.EmailAuthProvider.PROVIDER_ID],
  callbacks: {
    signInSuccessWithAuthResult: () => {
      console.log("signInSuccessWithAuthResult");
      return false;
    },
    signInFailure: (error) => {
      console.log("signInFailure");
      if (error.code !== "firebaseui/anonymous-upgrade-merge-conflict") {
        return Promise.resolve();
      }
      const cred = error.credential;
      return fbCore.auth().signInWithCredential(cred);
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
  return (
    <>
      {user && user.email ? (
        <p>
          Already Logged In. <Link to="/">Return to home page.</Link>
        </p>
      ) : (
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={fbCore.auth()} />
      )}
    </>
  );
}
