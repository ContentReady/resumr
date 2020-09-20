import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { auth, fbCore } from "./Firebase";

export default function AuthGuard({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setIsLoading(false);
      } else {
        fbCore
          .auth()
          .signInAnonymously()
          .catch(function (error) {
            console.error(error);
          });
      }
    });
  }, []);

  return <>{!isLoading && user ? children : <p>Loading...</p>}</>;
}

AuthGuard.propTypes = {
  children: PropTypes.any,
};
