import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import ContentCard from "./ContentCard";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  card: {
    height: 140,
    width: 100,
  },
  media: {
    height: 140,
  },
}));

export default function PublicLibrary() {
  const [spacing, setSpacing] = React.useState(2);
  const classes = useStyles();
  const publicContent = [
    {
      id: "1",
      thumbnail: "",
      title: "The Time Travel - HG Wells",
      type: "pdf",
    },
    {
      id: "2",
      thumbnail: "",
      title: "Hell Yeah or No!",
      type: "audio",
    },
    {
      id: "3",
      thumbnail: "",
      title: "Life of Brian",
      type: "video",
    },
  ];
  return (
    <>
      {/* <Typography>Free Downloads</Typography> */}
      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={spacing}>
            {publicContent.map((content) => (
              <Grid key={content.id} item>
                <ContentCard content={content} className={classes.card} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
