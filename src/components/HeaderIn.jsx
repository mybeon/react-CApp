import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { DispatchContext, StateContext } from "../context";

function HeaderIn() {
  const appDispatch = useContext(DispatchContext);
  const { user, unReadChatCount } = useContext(StateContext);
  function handleSignOut() {
    appDispatch({ type: "logout" });
    appDispatch({ type: "flashMessage", value: "Logged out." });
  }

  function handleSearch(e) {
    e.preventDefault();
    appDispatch({ type: "openSearch" });
  }
  return (
    <div className="flex-row my-3 my-md-0">
      <a onClick={handleSearch} href="/" className="text-white mr-2 header-search-icon">
        <i className="fas fa-search"></i>
      </a>
      <span
        onClick={() => appDispatch({ type: "toggleChat" })}
        className={"mr-2 header-chat-icon " + (unReadChatCount ? "text-danger" : "text-white")}
      >
        <i className="fas fa-comment"></i>
        {unReadChatCount ? <span className="chat-count-badge text-white">{unReadChatCount < 10 ? unReadChatCount : "9+"}</span> : ""}
      </span>
      <Link to={`/profile/${user.username}`} className="mr-2">
        <img alt="profile avatar" className="small-header-avatar" src={user.avatar} />
      </Link>
      <Link className="btn btn-sm btn-success mr-2" to="/create-post">
        Create Post
      </Link>
      <button onClick={handleSignOut} className="btn btn-sm btn-secondary">
        Sign Out
      </button>
    </div>
  );
}

export default HeaderIn;
