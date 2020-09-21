import React from "react";
import { Router } from "@reach/router";
import Home from "./pages/Home";
import Content from "./pages/Content";
import Login from "./pages/Login";
import Help from "./pages/Help";
import AuthGuard from "./components/AuthGuard";
import Nav from "./components/Nav";
import { Container } from "@material-ui/core";

function App() {
  return (
    <div>
      <Nav />
      <Container maxWidth="xl">
        <AuthGuard>
          <Router>
            <Home path="/" />
            <Help path="/help" />
            <Content path="/content/:id" />
            <Login path="/login" />
          </Router>
        </AuthGuard>
      </Container>
    </div>
  );
}

export default App;
