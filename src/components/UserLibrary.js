import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { db, auth } from "./Firebase";
import PDFIcon from "../assets/images/pdf.png";
import AudioIcon from "../assets/images/audio.png";
import VideoIcon from "../assets/images/video.png";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 20,
    textAlign: "center",
  },
  card: {
    height: 140,
    width: 100,
  },
  media: {
    height: 140,
  },
  table: {
    minWidth: 650,
  },
}));

export default function UserLibrary({ openContent }) {
  const [userContent, setUserContent] = useState([]);
  const classes = useStyles();
  const icons = {
    pdf: PDFIcon,
    audio: AudioIcon,
    video: VideoIcon,
  };

  const getContentType = (type) => {
    if (type.toLowerCase().includes("pdf")) {
      return "pdf";
    } else if (type.toLowerCase().includes("audio")) {
      return "audio";
    } else if (type.toLowerCase().includes("video")) {
      return "video";
    }
  };

  useEffect(() => {
    if (userContent.length) {
      return;
    }
    db.collection("users")
      .doc(auth.currentUser.uid)
      .collection("content")
      .orderBy("lastPlayed", "desc")
      .get()
      .then((querySnapshot) => {
        const contentArray = [];
        querySnapshot.forEach((doc) => {
          const obj = doc.data();
          obj["id"] = doc.id;
          contentArray.push(obj);
        });
        setUserContent(contentArray);
      })
      .catch((e) => {
        console.error(e);
      });
  });
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell>Title</TableCell>
            {/* <TableCell>Uploaded</TableCell> */}
            <TableCell>Last Played</TableCell>
            <TableCell>Position</TableCell>
            <TableCell align="right">Size&nbsp;(MB)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {userContent.length ? (
            userContent.map((row) => (
              <TableRow onClick={() => openContent(row.id)} key={row.id}>
                <TableCell component="th" scope="row">
                  {row.type && (
                    <img
                      width="32"
                      src={icons[getContentType(row.type)]}
                      alt={row.type}
                    />
                  )}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.title}
                </TableCell>
                {/* <TableCell component="th" scope="row">
                {row.uploaded && row.uploaded.toDate().toLocaleString()}
              </TableCell> */}
                <TableCell component="th" scope="row">
                  {row.lastPlayed && row.lastPlayed.toDate().toLocaleString()}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.type === "application/pdf"
                    ? `${row.position} / ${row.totalLength} pages`
                    : `${Math.floor(row.position / 60)}:${
                        row.position % 60
                      } / ${Math.floor(row.totalLength / 60)}:${
                        row.totalLength % 60
                      }`}
                </TableCell>
                <TableCell align="right">
                  {(row.size / 10e6).toFixed(2)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell>Upload some content to get started!</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
