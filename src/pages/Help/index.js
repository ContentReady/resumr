import React from "react";
import { Container, makeStyles, Typography } from "@material-ui/core";

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
    padding: "1rem",
  },
}));

export default function Help() {
  const classes = useStyles();

  return (
    <Container maxWidth="md" disableGutters={true}>
      <Typography variant="h6" component="h6" className={classes.paragraph}>
        <b>Resumr</b> lets you read PDFs, listen to audio and watch videos
        completely offline and continue where you left off.
      </Typography>
      <Typography variant="body1" component="p" className={classes.paragraph}>
        Resumr is offline-first and completely anonymous if you don't sign in.
        When you sign in, you can sync content to your other devices (coming
        soon!).
      </Typography>

      <Typography variant="body1" component="p" className={classes.paragraph}>
        We hope you like it :-). If you do, please do share the love!
      </Typography>
      <Typography variant="body1" component="p" className={classes.paragraph}>
        Powered by{" "}
        <a
          href="https://contentready.co/"
          target="_blank"
          rel="noreferrer noopener"
        >
          ContentReady
        </a>
        . ContentReady enables educators create, manage and distribute content
        at scale.
      </Typography>
    </Container>
  );
}
