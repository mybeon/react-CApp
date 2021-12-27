import React, { useContext, useEffect } from "react";
import { StateContext } from "../context";
import { useImmer } from "use-immer";
import axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";
import Loading from "./Loading";

function HomeFeed() {
  const { user } = useContext(StateContext);
  const [state, setState] = useImmer({
    isLoading: true,
    feed: [],
  });

  useEffect(() => {
    const ourRequest = axios.CancelToken.source();
    (() => {
      axios
        .post("/getHomeFeed", { token: user.token }, { cancelToken: ourRequest.token })
        .then((res) => {
          setState((draft) => {
            draft.isLoading = false;
            draft.feed = res.data;
          });
        })
        .catch(() => {
          console.log("error");
        });
    })();
    return () => {
      ourRequest.cancel();
    };
  }, [user.token, setState]);

  if (state.isLoading) return <Loading />;

  return (
    <>
      {state.feed.length > 0 && (
        <>
          <h2 className="text-center mb-4">The latest posts from those you follow !</h2>
          <div className="list-group">
            {state.feed.map((post) => {
              return (
                <Link key={post._id} to={`/post/${post._id}`} className="list-group-item list-group-item-action">
                  <img className="avatar-tiny" alt="profile avatar" src={post.author.avatar} /> <strong>{post.title} </strong>
                  <span className="text-muted small">
                    on {moment(post.createdDate).format("MM/D/YYYY")} by {post.author.username}{" "}
                  </span>
                </Link>
              );
            })}
          </div>
        </>
      )}
      {state.feed.length === 0 && (
        <div className="container container--narrow py-md-5">
          <h2 className="text-center">
            Hello <strong>{user.username}</strong>, your feed is empty.
          </h2>
          <p className="lead text-muted text-center">
            Your feed displays the latest posts from the people you follow. If you don&rsquo;t have any friends to follow that&rsquo;s okay; you can
            use the &ldquo;Search&rdquo; feature in the top menu bar to find content written by people with similar interests and then follow them.
          </p>
        </div>
      )}
    </>
  );
}

export default HomeFeed;
