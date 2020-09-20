import React, { useState } from "react";
import logo from "../logo.svg";
import { navigate } from "@reach/router";
import { useDropzone } from "react-dropzone";
import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { storage, auth, db } from "./Firebase";

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

export default function Basic(props) {
  const classes = useStyles();
  const [uploading, setUploading] = useState(false);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: "application/pdf, audio/mp3, video/mp4",
    multiple: false,
    maxFiles: 1,
    onDropAccepted: (files) => {
      setUploading(true);
      const file = files[0];
      const fileRef = storage
        .ref()
        .child(`${auth.currentUser.uid}/uploads/${file.name}`);
      fileRef.put(file).then((snapshot) => {
        const payload = {
          title: file.name,
          source: `gs://resumr-8540b.appspot.com/${snapshot.metadata.fullPath}`,
          type: file.type,
        };
        db.collection("users")
          .doc(auth.currentUser.uid)
          .collection("content")
          .add(payload)
          .then((docRef) => {
            navigate(`/content/${docRef.id}`);
          });
      });
    },
  });

  return (
    <Paper className={classes.paper}>
      {uploading ? (
        <p>Uploading file. Please wait...</p>
      ) : (
        <div {...getRootProps({ className: "dropzone" })}>
          <img src={logo} className="Home-logo" alt="logo" />
          <input
            {...getInputProps()}
            accept="application/pdf, audio/mp3, video/mp4"
          />
          <Typography gutterBottom variant="h3" component="h1">
            Click or drag &amp; drop to load a file.
          </Typography>
        </div>
      )}
    </Paper>
  );
}
