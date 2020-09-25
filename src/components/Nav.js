import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  makeStyles,
  AppBar,
  Toolbar,
  IconButton,
  Button,
} from "@material-ui/core";
import { Link, navigate } from "@reach/router";
import logo from "../logo.svg";
import HelpIcon from "@material-ui/icons/Help";
import ShareIcon from "@material-ui/icons/Share";
import TwitterIcon from "@material-ui/icons/Twitter";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import SyncIcon from "@material-ui/icons/Sync";
import { auth } from "./Firebase";
import { syncContent } from "./DB";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Subscribe from "./Subscribe";

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
  rotateIcon: {
    transform: "rotate(-90deg)",
  },
}));

function SimpleDialog({ open, onClose, onClick }) {
  const classes = useStyles();

  return (
    <Dialog aria-labelledby="simple-dialog-title" open={open} onClose={onClose}>
      <DialogTitle id="simple-dialog-title">Let's get started</DialogTitle>
      <Subscribe onClick={onClick} />
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default function Nav() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [user, setUser] = useState();
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      }
    });
  }, []);

  // useEffect(() => {
  //   if (isSyncing) {
  //     setRotationAngle(rotationAngle + 1);
  //   }
  // }, [isSyncing]);

  const handleLogout = () => {
    auth.signOut();
    window.location.reload();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };

  const handleLinkClick = () => {
    handleClose();
    navigate("/login");
  };

  const handleSync = () => {
    // Start rotating
    // const timer = setInterval(() => {
    //   console.log("rotating", rotationAngle);
    //   setRotationAngle(rotationAngle + 30);
    // }, 2000);
    // setIsSyncing(true);
    syncContent()
      .then(() => {
        // stop rotating
        // clearTimeout(timer);
      })
      .catch((e) => {
        console.error(e);
        // stop rotating
        // clearTimeout(timer);
      });
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
            <IconButton aria-label="sync" onClick={handleSync}>
              <SyncIcon style={{ transform: `rotate(-${rotationAngle}deg)` }} />
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
            // <Button
            //   variant="contained"
            //   color="secondary"
            //   aria-label="login"
            //   component={Link}
            //   to="/login"
            // >
            //   Login
            // </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleClickOpen}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <SimpleDialog
        open={open}
        onClose={handleClose}
        onClick={handleLinkClick}
      />
    </div>
  );
}
