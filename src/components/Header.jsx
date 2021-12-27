import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { StateContext } from "../context";
import HeaderIn from "./HeaderIn";
import HeaderOut from "./HeaderOut";

function Header({ staticRender }) {
  const appState = useContext(StateContext);
  const headerContent = appState.loggedIn ? <HeaderIn /> : <HeaderOut />;
  return (
    <header className="header-bar bg-primary mb-3">
      <div className="container d-flex flex-column flex-md-row align-items-center p-3">
        <h4 className="my-0 mr-md-auto font-weight-normal">
          <Link to="/" className="text-white">
            Capp
          </Link>
        </h4>
        {!staticRender ? headerContent : ""}
      </div>
    </header>
  );
}

export default Header;
