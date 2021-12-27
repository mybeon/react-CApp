import React, { useContext, useEffect } from "react";
import { DispatchContext } from "../context";
import { useImmer } from "use-immer";
import axios from "axios";
import { Link } from "react-router-dom";
import moment from "moment";

function Search() {
  const appDispatch = useContext(DispatchContext);
  const [state, setstate] = useImmer({
    searchTerm: "",
    results: [],
    show: "neither",
    requestCount: 0,
  });

  useEffect(() => {
    function searchKeyHandler(e) {
      if (e.keyCode === 27) {
        appDispatch({ type: "closeSearch" });
      }
    }
    document.addEventListener("keyup", searchKeyHandler);
    return () => {
      document.removeEventListener("keyup", searchKeyHandler);
    };
  }, [appDispatch]);

  useEffect(() => {
    if (state.searchTerm.trim()) {
      setstate((draft) => {
        draft.show = "loading";
      });
      const delay = setTimeout(() => {
        setstate((draft) => {
          draft.requestCount++;
        });
      }, 850);

      return () => clearTimeout(delay);
    } else {
      setstate((draft) => {
        draft.show = "neither";
      });
    }
  }, [state.searchTerm, setstate]);

  useEffect(() => {
    if (state.requestCount) {
      const request = axios.CancelToken.source();
      axios
        .post("/search", { searchTerm: state.searchTerm }, { cancelToken: request.token })
        .then((res) => {
          setstate((draft) => {
            draft.results = res.data;
            draft.show = "results";
          });
        })
        .catch(() => {});
      return () => request.cancel();
    }
  }, [state.requestCount, setstate, state.searchTerm]);

  function handleInput(e) {
    const value = e.target.value;
    setstate((draft) => {
      draft.searchTerm = value;
    });
  }
  return (
    <>
      <div className="search-overlay-top shadow-sm">
        <div className="container container--narrow">
          <label htmlFor="live-search-field" className="search-overlay-icon">
            <i className="fas fa-search"></i>
          </label>
          <input
            autoFocus
            type="text"
            autoComplete="off"
            id="live-search-field"
            className="live-search-field"
            placeholder="What are you interested in?"
            onChange={handleInput}
          />
          <span onClick={() => appDispatch({ type: "closeSearch" })} className="close-live-search">
            <i className="fas fa-times-circle"></i>
          </span>
        </div>
      </div>

      <div className="search-overlay-bottom">
        <div className="container container--narrow py-3">
          <div className={"circle-loader " + (state.show === "loading" ? "circle-loader--visible" : "")}></div>
          <div className={"live-search-results " + (state.show === "results" ? "live-search-results--visible" : "")}>
            {Boolean(state.results.length) && (
              <div className="list-group shadow-sm">
                <div className="list-group-item active">
                  <strong>Search Results</strong> ({state.results.length} {state.results.length > 1 ? "items" : "item"} found)
                </div>
                {state.results.map((post) => {
                  return (
                    <Link
                      onClick={() => appDispatch({ type: "closeSearch" })}
                      key={post._id}
                      to={`/post/${post._id}`}
                      className="list-group-item list-group-item-action"
                    >
                      <img className="avatar-tiny" alt="profile avatar" src={post.author.avatar} /> <strong>{post.title} </strong>
                      <span className="text-muted small">
                        on {moment(post.createdDate).format("MM/D/YYYY")} by {post.author.username}{" "}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
            {!Boolean(state.results.length) && (
              <div className="alert alert-danger text-center shadow-sm">Sorry, we couldn't find any result for this search</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Search;
