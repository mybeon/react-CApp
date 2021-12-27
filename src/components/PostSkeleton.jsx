import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion } from "framer-motion";

function PostSkeleton() {
  const variants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
  };
  return (
    <motion.div variants={variants} initial="hidden" animate="visible" transition={{ duration: 0.6, ease: [0.075, 0.82, 0.165, 1] }}>
      <div className="skeleton-react">
        <Skeleton count={1} circle={true} width={40} height={40} />
        <Skeleton count={1} width={200} className="skeleton-txt" />
      </div>
      <div className="skeleton-react">
        <Skeleton count={1} circle={true} width={40} height={40} />
        <Skeleton count={1} width={200} className="skeleton-txt" />
      </div>
      <div className="skeleton-react">
        <Skeleton count={1} circle={true} width={40} height={40} />
        <Skeleton count={1} width={200} className="skeleton-txt" />
      </div>
      <div className="skeleton-react">
        <Skeleton count={1} circle={true} width={40} height={40} />
        <Skeleton count={1} width={200} className="skeleton-txt" />
      </div>
    </motion.div>
  );
}

export default PostSkeleton;
