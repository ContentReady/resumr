import React from "react";
import { Router } from "@reach/router";
import Home from "./pages/Home";
import Content from "./pages/Content";
import Help from "./pages/Help";
import Nav from "./components/Nav";
import { Container } from "@material-ui/core";

function App() {
  return (
    <div>
      <Nav />
      <Container maxWidth="xl">
        <Router>
          <Home path="/" />
          <Content path="/content/:id" />
          <Help path="/help" />
        </Router>
      </Container>
    </div>
  );
}

export default App;
