import React from "react";
import { Router, Link } from "@reach/router";
import Home from "./pages/Home/Home";
import { Container } from "@material-ui/core";

function App() {
  return (
    <Container maxWidth="xl">
      <Router>
        <Home path="/" />
      </Router>
    </Container>
  );
}

export default App;
