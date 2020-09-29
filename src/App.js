import React, { lazy, Suspense, useState } from "react";
import { Router } from "@reach/router";

const Home = lazy(() => import("./pages/Home"));
const Content = lazy(() => import("./pages/Content"));
const Help = lazy(() => import("./pages/Help"));
const Login = lazy(() => import("./pages/Login"));
const Nav = lazy(() => import("./components/Nav"));
const renderLoader = () => <p>Resumr is loading...</p>;

function App() {
  let firstTimeUser = true;
  if (localStorage.getItem("firstTimeUser") === "0") {
    firstTimeUser = false;
  }
  const [helpShown, setHelpShown] = useState(firstTimeUser);
  const showHelp = () => {
    setHelpShown(true);
  };
  return (
    <Suspense fallback={renderLoader()}>
      <Nav handleHelpClick={showHelp} />
      <Router>
        <Home helpShown={helpShown} setHelpShown={setHelpShown} path="/" />
        <Content path="/content/:id" />
        <Help path="/help" />
        <Login path="/login" />
      </Router>
    </Suspense>
  );
}

export default App;
