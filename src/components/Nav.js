import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { Link } from "@reach/router";
import { Button, IconButton } from "@material-ui/core";
import { auth } from "./Firebase";
import logo from "../logo.svg";
import HelpIcon from "@material-ui/icons/Help";
import ShareIcon from "@material-ui/icons/Share";
import TwitterIcon from "@material-ui/icons/Twitter";
import { blue } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    color: theme.palette.getContrastText(blue[500]),
  },
  title: {
    flexGrow: 1,
  },
  button: {
    color: theme.palette.getContrastText(blue[500]),
    backgroundColor: blue[500],
    "&:hover": {
      backgroundColor: blue[700],
    },
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

  const shareApp = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Resumr",
          text:
            "Resumr allows you to resume PDFs, Audio and Video where you left off!",
          url: "https://resumr.io/",
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    }
  };

  const tweetApp = () => {
    window.open(
      "https://twitter.com/intent/tweet/?text=Resumr%20allows%20you%20to%20upload%2C%20consume%20and%20resume%20%23PDFs%2C%20%23Audio%20and%20%23Video%20where%20you%20left%20off%21%20Works%20offline%20too%20%3A-%29%20%23pwa%20%23offline&url=https%3A%2F%2Fresumr.io",
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

          {user && user.email ? (
            <Button onClick={handleLogout}>Logout</Button>
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
