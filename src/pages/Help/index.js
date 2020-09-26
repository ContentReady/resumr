import React from "react";
import { Container, makeStyles, Typography } from "@material-ui/core";
import { Link } from "@reach/router";

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

export default function Help() {
  const classes = useStyles();

  return (
    <Container maxWidth="md" disableGutters={true}>
      <Typography variant="h4" component="h1" className={classes.heading}>
        Why?
      </Typography>
      <Typography variant="h6" component="p" className={classes.paragraph}>
        If you, like me, read a lot of PDFs and listen to audiobooks, Resumr is
        for you.
      </Typography>
      <Typography variant="body1" component="p" className={classes.paragraph}>
        About an era after the rest of the internet, I recently discovered{" "}
        <a href="https://sive.rs/" target="_blank" rel="noreferrer noopener">
          Derek Sivers
        </a>
        . I was excited to start listening to the audio version of "Hell Yeah or
        No", on my walks with Tiku (aka TikTok). I got through about 30 minutes
        on day 1. The next couple of walks were spent watching the NBA playoffs.
        When I finally got back to the book, I had lost track of where I was.
      </Typography>
      <Typography variant="body1" component="p" className={classes.paragraph}>
        Sound familiar? Turns out, there isn't an app out there that lets you
        resume multiple books, audio or videos from where you left off.
      </Typography>
      <Typography variant="body1" component="p" className={classes.paragraph}>
        We build{" "}
        <a
          href="https://contentready.co/"
          target="_blank"
          rel="noreferrer noopener"
        >
          ContentReady
        </a>{" "}
        for a living and enable educators create, manage and distribute content
        at scale. We had been offering these very features for a couple of
        years!
      </Typography>

      <Typography variant="body1" component="p" className={classes.paragraph}>
        So, we took the essential bits and built Resumr. We hope you like it
        :-). If you do, please do share the love!
      </Typography>

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
        Resumr uses the browser's IndexedDB to store content offline. While
        limits vary across browsers, you can typically store around 1GB of
        content offline. Online sync currently has a soft limit of 2GB per user.
        We do not auto-delete your content but we will get in touch if you are
        over the limit. Serious and persistent abuse of this limit may lead to
        deactivation of your account.
      </Typography>
      <Typography variant="h4" component="h3" className={classes.paragraph}>
        Legals!
      </Typography>
      <Typography variant="body1" component="p" className={classes.paragraph}>
        <Link to="/terms">Terms & Conditions</Link>
      </Typography>
      <Typography variant="body1" component="p" className={classes.paragraph}>
        <Link to="/privacy">Privacy Policy</Link>
      </Typography>
    </Container>
  );
}
