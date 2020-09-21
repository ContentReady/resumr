import React, { useState } from "react";
import { navigate } from "@reach/router";
import { useDropzone } from "react-dropzone";
import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { storage, auth, rtdb } from "./Firebase";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { v4 as uuidv4 } from "uuid";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    backgroundColor: "#EEEEEE",
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

export default function Basic(props) {
  const classes = useStyles();
  const [uploading, setUploading] = useState(false);
  const { getRootProps, getInputProps } = useDropzone({
    accept: "application/pdf, audio/*, video/*",
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
          size: file.size,
          lastModified: file.lastModified,
          uploaded: new Date(),
        };
        const contentId = uuidv4();
        rtdb
          .ref(`users/${auth.currentUser.uid}/content/${contentId}`)
          .set(payload)
          .then(() => {
            navigate(`/content/${contentId}`);
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
          <CloudUploadIcon />
          <input
            {...getInputProps()}
            accept="application/pdf, audio/mp3, video/mp4"
          />
          <Typography variant="h6" component="h4">
            Upload a PDF, MP4 or MP3.
          </Typography>
        </div>
      )}
    </Paper>
  );
}
