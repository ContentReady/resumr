import React from "react";
import { Router } from "@reach/router";
import Home from "./pages/Home";
import Content from "./pages/Content";
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
        </Router>
      </Container>
    </div>
  );
}

export default App;
