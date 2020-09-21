import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { Link } from "@reach/router";
import { Button } from "@material-ui/core";
import { auth } from "./Firebase";
import logo from "../logo.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Nav() {
  const classes = useStyles();
  const [user, setUser] = React.useState();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      }
    });
  }, []);

  const handleLogout = () => {
    auth.signOut();
    window.location.reload();
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Link to="/" className={classes.title}>
            <img src={logo} alt="Resumer" width="64" />
          </Link>
          {user && user.email ? (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              component={Link}
              to="/login"
            >
              Login To Sync
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
