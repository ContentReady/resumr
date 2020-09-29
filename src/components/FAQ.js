import React from "react";
import { makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  container: {
    display: "flex",
    justifyContent: "center",
  },
  paragraph: {
    paddingLeft: "1rem",
    paddingRight: "1rem",
    paddingBottom: "1rem",
  },
  heading: {
    paddingLeft: "1rem",
    paddingRight: "1rem",
    paddingTop: "1rem",
  },
}));

export default function FAQ() {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h4" component="h3" className={classes.paragraph}>
        FAQs
      </Typography>
      <Typography variant="h6" component="h5" className={classes.heading}>
        Do I need to subscribe to use the app after my 30 day trial ends?
      </Typography>
      <Typography variant="body1" component="p" className={classes.paragraph}>
        No, even after your trial ends, you can continue using Resumr offline
        forever :-). Subscribing supports us and lets you sync and resume
        content across all your devices.
      </Typography>
      <Typography variant="h6" component="h5" className={classes.heading}>
        What does sync mean?
      </Typography>
      <Typography variant="body1" component="p" className={classes.paragraph}>
        Sync lets you upload a book or a video on your laptop and access it on
        your phone, or on your tablet! Your content and position is copied, via
        our cloud servers, across your devices as soon as you log in!
      </Typography>
      <Typography variant="h6" component="h5" className={classes.heading}>
        Is my content private?
      </Typography>
      <Typography variant="body1" component="p" className={classes.paragraph}>
        Absolutely! If you don't sign in, your content never leaves your device.
        Once you sign in, we store your content, anonymised, on our servers to
        allow syncing. No one other than you can access your content.
      </Typography>
      <Typography variant="h6" component="h5" className={classes.heading}>
        Can I install Resumr on my phone?
      </Typography>
      <Typography variant="body1" component="p" className={classes.paragraph}>
        Yes, you can! Resumr is a progressive web app (PWA) and can be run
        completely offline. You should see see an option within your browser to
        add/install Resumr to your home screen.
      </Typography>
      <Typography variant="h6" component="h5" className={classes.heading}>
        Why do I still see my content after I have signed out?
      </Typography>
      <Typography variant="body1" component="p" className={classes.paragraph}>
        Resumr stores a copy of all your content offline within your browser
        cache. This allows the progressive web app (PWA) to work completely
        offline. Signing out disables sync but keeps your offline content
        intact.
      </Typography>
      <Typography variant="h6" component="h5" className={classes.heading}>
        Can I use Resumr as a backup service?
      </Typography>
      <Typography variant="body1" component="p" className={classes.paragraph}>
        Please do not :-). While we make every effort to keep your content safe,
        we **strongly** recommend using Google Drive, Dropbox or similar for
        backup!
      </Typography>
      <Typography variant="h6" component="h5" className={classes.heading}>
        How much content can I save?
      </Typography>
      <Typography variant="body1" component="p" className={classes.paragraph}>
        Resumr uses the browser's internal storage to store content offline.
        While limits vary across browsers, you can typically store around 1GB of
        content offline. Online sync currently has a soft limit of 2GB per user.
        We do not auto-delete your content but we will get in touch if you are
        over the limit.
      </Typography>
      <Typography variant="h6" component="h5" className={classes.heading}>
        Does Resumr have a library of content?
      </Typography>
      <Typography variant="body1" component="p" className={classes.paragraph}>
        This early release of Resumr does not include a public library. We are
        gathering user inputs on what kind of content they would be interested.
        Please write to us if you could share your inputs.
      </Typography>
    </>
  );
}
