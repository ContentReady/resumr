import React, { useState, useEffect } from "react";
import {
  Typography,
  makeStyles,
  CircularProgress,
  Grid,
} from "@material-ui/core";
import { auth, db } from "../../components/Firebase";
import offline from "../../components/OfflineStorage";
import ContentView from "../../components/ContentView";

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

export default function Content({ id }) {
  const classes = useStyles();
  const [content, setContent] = useState({});
  const [sensibleUrl, setSensibleUrl] = useState("");
  useEffect(() => {
    if (id) {
      db.collection("users")
        .doc(auth.currentUser.uid)
        .collection("content")
        .doc(id)
        .get()
        .then((doc) => {
          const data = doc.data();
          setContent(data);
          // Our hosted contentUrl will need to be:
          // 1. Publicly accessible OR
          // 2. Hosted on Firebase with a gs:// URL
          if (data.source.startsWith("gs://")) {
            offline(data.source).then((url) => {
              setSensibleUrl(url);
            });
          } else {
            setSensibleUrl(data.source);
          }
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [id]);
  if (!content || !content.title) {
    return (
      <Grid container alignItems="center" justify="center">
        <CircularProgress />
      </Grid>
    );
  }
  return (
    <div>
      <main>
        <div direction="column" pad="medium">
          <Typography
            color="textSecondary"
            variant="h2"
            component="h2"
            align="center"
            className={classes.heading}
          >
            {content.title}
          </Typography>
          {sensibleUrl ? (
            <ContentView
              id={id}
              title={content.title}
              type={content.type}
              source={sensibleUrl}
            />
          ) : (
            <Typography
              variant="h5"
              component="p"
              color="textSecondary"
              align="center"
            >
              Getting URL...
            </Typography>
          )}
        </div>
      </main>
    </div>
  );
}
