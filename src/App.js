import React, { lazy, Suspense } from "react";
import { Router } from "@reach/router";
// import Home from "./pages/Home";
// import Content from "./pages/Content";
// import Help from "./pages/Help";
// import Login from "./pages/Login";
// import Nav from "./components/Nav";

const Home = lazy(() => import("./pages/Home"));
const Content = lazy(() => import("./pages/Content"));
const Help = lazy(() => import("./pages/Help"));
const Login = lazy(() => import("./pages/Login"));
const Nav = lazy(() => import("./components/Nav"));
const renderLoader = () => <p>Resumr is loading...</p>;

function App() {
  return (
    // <div>
    <Suspense fallback={renderLoader()}>
      <Nav />
      <Router>
        <Home path="/" />
        <Content path="/content/:id" />
        <Help path="/help" />
        <Login path="/login" />
      </Router>
    </Suspense>
    // </div>
  );
}

export default App;
