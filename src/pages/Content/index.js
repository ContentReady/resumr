import React from "react";
import ContentDetails from "../../components/ContentDetails";

export default function Content({ id }) {
  if (id) {
    return <ContentDetails id={id} />;
  } else {
    return <p>Content ID not found.</p>;
  }
}
