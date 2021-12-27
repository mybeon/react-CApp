import React, { useEffect, useState } from "react";
import axios from "axios";
import PostSkeleton from "./PostSkeleton";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function FollowProfile({ username, type }) {
  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    setLoading(true);
    const ourRequest = axios.CancelToken.source();
    (() => {
      axios
        .get(`/profile/${username}/${type}`, { cancelToken: ourRequest.token })
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
  }, [username, type]);

  if (loading) return <PostSkeleton />;

  return (
    <motion.div variants={variants} initial="hidden" animate="visible" transition={{ duration: 0.6 }}>
      <div className="list-group">
        {posts.map((follow, index) => {
          return (
            <Link key={index} to={`/profile/${follow.username}`} className="list-group-item list-group-item-action">
              <img className="avatar-tiny" alt="profile avatar" src={follow.avatar} /> {follow.username}
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}

export default FollowProfile;
