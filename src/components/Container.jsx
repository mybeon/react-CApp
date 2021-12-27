import React from "react";
import { Helmet } from "react-helmet";

function Container({ children, wide, title }) {
  return (
    <div className={"container py-md-5 " + (wide ? "" : "container--narrow")}>
      <Helmet>
        <title>{title + " | CApp"}</title>
      </Helmet>
      {children}
    </div>
  );
}

export default Container;
