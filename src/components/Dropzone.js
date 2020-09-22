import React, { useState } from "react";
import { navigate } from "@reach/router";
import { useDropzone } from "react-dropzone";
import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { storeContent } from "./DB";

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
    onDropAccepted: async (files) => {
      setUploading(true);
      const file = files[0];
      const contentId = await storeContent(file);
      navigate(`/content/${contentId}`);
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
