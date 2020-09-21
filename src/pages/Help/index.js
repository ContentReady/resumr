import React from "react";
import { Grid, makeStyles, Paper, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  container: {
    display: "flex",
    justifyContent: "center",
  },
  paper: {
    position: "absolute",
    width: "45rem",
    // backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2, 4, 3),
  },
  paragraph: {
    paddingBottom: "1rem",
  },
}));

export default function Help() {
  const classes = useStyles();

  return (
    <>
      <Grid container classes={classes}>
        <Paper className={classes.paper}>
          <Typography variant="h2" component="h1" className={classes.paragraph}>
            Why Resumr?
          </Typography>
          <Typography variant="h6" component="p" className={classes.paragraph}>
            If you, like me, read a lot of PDFs and listen to audiobooks, Resumr
            is for you.
          </Typography>
          <Typography
            variant="body1"
            component="p"
            className={classes.paragraph}
          >
            About an era after the rest of the internet, I recently discovered{" "}
            <a
              href="https://sive.rs/"
              target="_blank"
              rel="noreferrer noopener"
            >
              Derek Sivers
            </a>
            . I was excited to start listening to the audio version of "Hell
            Yeah or No", on my walks with Tiku (aka TikTok). I got through about
            30 minutes on day 1. The next couple of walks were spent watching
            the NBA playoffs. When I finally got back to the book, I had lost
            track of where I was.
          </Typography>
          <Typography
            variant="body1"
            component="p"
            className={classes.paragraph}
          >
            So, on this walk, instead of listening, I searched the Play Store
            for an app that would let me listen to an MP3 and continue where I
            left off. I couldn't find one. You can't be serious!
          </Typography>
          <Typography
            variant="body1"
            component="p"
            className={classes.paragraph}
          >
            We build{" "}
            <a
              href="https://contentready.co/"
              target="_blank"
              rel="noreferrer noopener"
            >
              ContentReady
            </a>{" "}
            for a living and empower non-profits working with 10s of thousands
            of learners across India. We had been offering these very features,
            at scale, for a couple of years. So, the following weekend, I took
            the essential bits and built Resumr.
          </Typography>
          <Typography variant="body1" component="p">
            I hope you like it :-). If you do, please do share the love!
          </Typography>
        </Paper>
      </Grid>
      {/* <Grid container classes={classes}>
        <Paper className={classes.paper}>
          <Typography variant="h2" component="h1" className={classes.paragraph}>
            Privacy
          </Typography>
          <Typography variant="h6" component="p" className={classes.paragraph}>
            Your content is yours. We never peek.
          </Typography>
          <Typography
            variant="body1"
            component="p"
            className={classes.paragraph}
          >
            We use Google Analytics to understand where our users come from and
            to collect anonymised demographic data.
          </Typography>
          <Typography
            variant="body1"
            component="p"
            className={classes.paragraph}
          >
            Your passwords are stored securely using Firebase Authentication and
            are not accessible by us. We do not sell any of your data.
          </Typography>
        </Paper>
      </Grid> */}
    </>
  );
}
