import React, { useEffect, useState } from "react";
import axios from "axios";
import PostSkeleton from "./PostSkeleton";
import { Link } from "react-router-dom";
import moment from "moment";
import { motion } from "framer-motion";

function PostProfile({ username }) {
  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const ourRequest = axios.CancelToken.source();
    (() => {
      axios
        .get(`/profile/${username}/posts`, { cancelToken: ourRequest.token })
        .then((res) => {
          setPosts(res.data);
          setLoading(false);
        })
        .catch(() => {
          console.log("error");
        });
    })();
    return () => {
      ourRequest.cancel();
    };
  }, [username]);

  if (loading) return <PostSkeleton />;

  return (
    <motion.div variants={variants} initial="hidden" animate="visible" transition={{ duration: 0.6 }}>
      <div className="list-group">
        {posts.map((post) => {
          return (
            <Link key={post._id} to={`/post/${post._id}`} className="list-group-item list-group-item-action">
              <img className="avatar-tiny" alt="profile avatar" src={post.author.avatar} /> <strong>{post.title} </strong>
              <span className="text-muted small">on {moment(post.createdDate).format("MM/D/YYYY")} </span>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}

export default PostProfile;
