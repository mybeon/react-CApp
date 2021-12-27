import React, { useState, useEffect, useContext } from "react";
import Container from "../components/Container";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loading from "../components/Loading";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { StateContext, DispatchContext } from "../context";
import NotFound from "./NotFound";
import { motion, AnimatePresence } from "framer-motion";

function EditPost() {
  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
  };

  const navigate = useNavigate();

  const {
    user: { token, username },
  } = useContext(StateContext);
  const appDipatch = useContext(DispatchContext);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState({ title: "", body: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  useEffect(() => {
    const ourRequest = axios.CancelToken.source();
    (() => {
      axios
        .get(`/post/${id}`, { cancelToken: ourRequest.token })
        .then((res) => {
          if (res.data) {
            if (username === res.data.author.username) {
              setPost(res.data);
              setLoading(false);
            } else {
              appDipatch({ type: "flashMessage", value: "You do not have the permission." });
              navigate("/");
            }
          } else {
            console.log("bololo");
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
  }, [id, username, appDipatch, navigate]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: post.title,
      body: post.body,
    },
    validationSchema: Yup.object({
      title: Yup.string().min(3, "Title must be at least 3 characters").required("You must provide a title"),
      body: Yup.string().max(200, "Body must be at most 200 characters").required("You must provide body content"),
    }),
    onSubmit: (values) => {
      setIsSaving(true);
      console.log("saved");
      axios
        .post(`/post/${id}/edit`, { ...values, token })
        .then((res) => {
          appDipatch({ type: "flashMessage", value: "Post successfully updated" });
          setIsSaving(false);
        })
        .catch((err) => {
          console.log("error", err);
        });
    },
  });

  if (notFound) return <NotFound />;
  if (loading) return <Loading />;

  console.log(formik.errors);

  return (
    <Container title={`Edit - ${post.title}`}>
      <Link className="small font-weight-bold" to={`/post/${post._id}`}>
        &laquo; Back to post
      </Link>
      <form className="mt-3" onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>

          <input
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
            value={formik.values.title}
            onChange={formik.handleChange}
          />
          <AnimatePresence>
            {formik.errors.title && (
              <motion.div
                transition={{ duration: 0.5, ease: "anticipate" }}
                variants={variants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="alert alert-danger small liveValidateMessage"
              >
                {formik.errors.title}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            value={formik.values.body}
            onChange={formik.handleChange}
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
          />
          <AnimatePresence>
            {formik.errors.body && (
              <motion.div
                transition={{ duration: 0.5, ease: "anticipate" }}
                variants={variants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="alert alert-danger small liveValidateMessage"
              >
                {formik.errors.body}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button disabled={isSaving ? true : false} type="submit" className="btn btn-primary">
          Update
        </button>
      </form>
    </Container>
  );
}

export default EditPost;
