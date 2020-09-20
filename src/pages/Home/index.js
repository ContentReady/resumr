import React from "react";
import logo from "../../logo.svg";
import "./home.css";
import { Link } from "@reach/router";
import PublicLibrary from "../../components/PublicLibrary";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

function Home() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper} elevation={0}>
            <img src={logo} className="Home-logo" alt="logo" />
            <Typography gutterBottom variant="h2" component="h1">
              Click or drag &amp; drop to load a file.
            </Typography>
            <Typography gutterBottom variant="h4" component="h3">
              Or try one of these:
            </Typography>
          </Paper>
        </Grid>
        <PublicLibrary />
      </Grid>
    </div>
  );
}

export default Home;
