import React, { useState, useEffect } from "react";
import {
  makeStyles,
  AppBar,
  Toolbar,
  IconButton,
  Button,
} from "@material-ui/core";
import { Link } from "@reach/router";
import logo from "../logo.svg";
import HelpIcon from "@material-ui/icons/Help";
import ShareIcon from "@material-ui/icons/Share";
import TwitterIcon from "@material-ui/icons/Twitter";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import SyncIcon from "@material-ui/icons/Sync";
import { auth } from "./Firebase";
import { syncContent } from "./DB";

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

  const [user, setUser] = useState();

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

  const shareApp = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Resumr",
          text:
            "I am loving @resumr_io - lets you resume PDFs, audio and video where you left off, across devices! Get started in 30 seconds at https://resumr.io",
          url: "https://resumr.io/",
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    }
  };

  const tweetApp = () => {
    window.open(
      "https://twitter.com/intent/tweet/?text=I%20am%20loving%20%40resumr_io%20-%20lets%20you%20%23resume%20%23PDFs%2C%20%23audio%20and%20%23video%20where%20you%20left%20off%2C%20across%20devices%21%20Get%20started%20in%2030%20seconds%20at%20https%3A%2F%2Fresumr.io",
      "Twitter",
      "height=285,width=550,resizable=1"
    );
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Link to="/" className={classes.title}>
            <img src={logo} alt="Resumer" width="64" />
          </Link>
          {user && user.uid && (
            <IconButton aria-label="sync" onClick={syncContent}>
              <SyncIcon />
            </IconButton>
          )}
          {navigator.share ? (
            <IconButton aria-label="share" onClick={shareApp}>
              <ShareIcon />
            </IconButton>
          ) : (
            <IconButton aria-label="share" onClick={tweetApp}>
              <TwitterIcon />
            </IconButton>
          )}

          <IconButton aria-label="help" component={Link} to="/help">
            <HelpIcon />
          </IconButton>
          {user && user.uid ? (
            <IconButton aria-label="logout" onClick={handleLogout}>
              <ExitToAppIcon />
            </IconButton>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              aria-label="login"
              component={Link}
              to="/login"
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
