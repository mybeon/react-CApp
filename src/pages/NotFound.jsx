import React from "react";
import { Link } from "react-router-dom";
import Container from "../components/Container";

function NotFound() {
  return (
    <Container title="Not found 404">
      <div className="text-center">
        <h2>Whoops, we cannot find that page.</h2>
        <p className="lead text-muted">
          You can always visit the <Link to="/">homepage</Link> to get a fresh start.
        </p>
      </div>
    </Container>
  );
}

export default NotFound;
