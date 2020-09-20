import React from "react";
import { Router, Redirect } from "@reach/router";
import Home from "./pages/Home";
import Content from "./pages/Content";
import Login from "./pages/Login";
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
            <Content path="/content/:id" />
            <Login path="/login" />
          </Router>
        </AuthGuard>
      </Container>
    </div>
  );
}

export default App;
