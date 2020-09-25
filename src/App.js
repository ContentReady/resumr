import React from "react";
import { Router } from "@reach/router";
import Home from "./pages/Home";
import Content from "./pages/Content";
import Help from "./pages/Help";
import Login from "./pages/Login";
import Nav from "./components/Nav";
import Subscribe from "./components/Subscribe";

function App() {
  return (
    <div>
      <Nav />
      <Router>
        <Home path="/" />
        <Content path="/content/:id" />
        <Help path="/help" />
        <Login path="/login" />
        <Subscribe path="/subscribe" />
      </Router>
    </div>
  );
}

export default App;
