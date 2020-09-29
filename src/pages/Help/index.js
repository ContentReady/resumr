import React from "react";
import { Container, makeStyles, Typography } from "@material-ui/core";
import { Link } from "@reach/router";
import FAQ from "../../components/FAQ";

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

      <FAQ />
      <Typography variant="h4" component="h3" className={classes.paragraph}>
        Contact
      </Typography>
      <Typography variant="body1" component="p" className={classes.paragraph}>
        <a
          href="mailto:resumr@contentready.co"
          target="_blank"
          rel="noreferrer noopener"
        >
          resumr@contentready.co
        </a>
      </Typography>
      <Typography variant="body1" component="p" className={classes.paragraph}>
        <a
          href="https://twitter.com/resumr_io"
          target="_blank"
          rel="noreferrer noopener"
        >
          @resumr_io
        </a>
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
