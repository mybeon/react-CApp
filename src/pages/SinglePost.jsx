import React, { useState, useEffect, useContext } from "react";
import Container from "../components/Container";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loading from "../components/Loading";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import ReactMarkdown from "react-markdown";
import ReactTooltip from "react-tooltip";
import NotFound from "./NotFound";
import { StateContext, DispatchContext } from "../context";

function SinglePost() {
  const navigate = useNavigate();
  const { loggedIn, user } = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const ourRequest = axios.CancelToken.source();
    (() => {
      axios
        .get(`/post/${id}`, { cancelToken: ourRequest.token })
        .then((res) => {
          if (res.data) {
            setPost(res.data);
            setLoading(false);
          } else {
            setNotFound(true);
          }
        })
        .catch(() => {
          console.log("error");
        });
    })();
    return () => {
      ourRequest.cancel();
    };
  }, [id]);

  if (notFound) return <NotFound />;
  if (loading) return <Loading />;

  function isOwner() {
    if (loggedIn) {
      return user.username === post.author.username;
    }
  }

  function deleteHandler() {
    const confirm = window.confirm("Do you want to delete this post");
    if (confirm) {
      axios
        .delete(`/post/${id}`, { data: { token: user.token } })
        .then((res) => {
          console.log(res);
          if (res.data === "Success") {
            appDispatch({ type: "flashMessage", value: "Post successfully deleted" });
            navigate(`/profile/${user.username}`);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }
  return (
    <Container title={post.title}>
      <ReactTooltip place="top" effect="solid" delayHide={200} delayShow={200} backgroundColor="#007BFF" />
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {isOwner() && (
          <span className="pt-2">
            <Link data-tip="Edit" to={`/post/${post._id}/edit`} className="text-primary mr-2">
              <i className="fas fa-edit"></i>
            </Link>{" "}
            <button onClick={deleteHandler} data-tip="Delete" data-background-color="#DC3545" className="delete-post-button text-danger">
              <i className="fas fa-trash"></i>
            </button>
          </span>
        )}
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" alt="profile avatar" src={post.author.avatar} />
        </Link>
        Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {moment(post.createdDate).format("MM/D/YYYY")}
      </p>

      <div className="body-content">
        <ReactMarkdown children={post.body} />
      </div>
    </Container>
  );
}

export default SinglePost;
