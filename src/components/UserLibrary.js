import React, { useEffect, useState } from "react";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import { getContentList, deleteContentById, updateMetadata } from "./DB";
import EnhancedTable from "./EnhancedTable";

export default function UserLibrary() {
  const [userContent, setUserContent] = useState([]);
  const [dbRead, setDBRead] = useState(false);

  useEffect(() => {
    if (dbRead) {
      return;
    }
    getContentList().then((contentList) => {
      const contentArray = [];
      Promise.all(
        contentList.map((docPromise) => {
          return docPromise.then((doc) => {
            if (doc && doc.title) {
              contentArray.push(doc);
            }
          });
        })
      ).then(() => {
        setUserContent(contentArray);
      });
      setDBRead(true);
    });
  });

  const deleteRow = (contentId) => {
    return deleteContentById(contentId).then(() => {
      setDBRead(false);
    });
  };

  const editContentTitle = (contentId) => {
    const newTitle = prompt("What do you want to call this file?");
    if (newTitle) {
      return updateMetadata(contentId, { title: newTitle }).then(() =>
        setDBRead(false)
      );
    }
  };

  return (
    <TableContainer component={Paper}>
      <EnhancedTable
        rows={userContent}
        deleteContentById={deleteRow}
        editContentTitle={editContentTitle}
        path="/table"
      />
    </TableContainer>
  );
}
