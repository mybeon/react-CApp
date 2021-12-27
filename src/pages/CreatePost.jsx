import React, { useContext } from "react";
import Container from "../components/Container";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { DispatchContext, StateContext } from "../context";

function CreatePost() {
  const appDispatch = useContext(DispatchContext);
  const {
    user: { token },
  } = useContext(StateContext);
  let navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      title: "",
      body: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("required"),
      body: Yup.string().required("required"),
    }),
    onSubmit: (values) => {
      axios
        .post("/create-post", { ...values, token })
        .then((res) => {
          if (res.data) {
            navigate(`/post/${res.data}`);
            appDispatch({ type: "flashMessage", value: "Post created successfully." });
          }
        })
        .catch((err) => {
          console.log("error", err);
        });
    },
  });
  return (
    <Container title="Create New Post">
      <form onSubmit={formik.handleSubmit}>
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
        </div>

        <button type="submit" className="btn btn-primary">
          Save New Post
        </button>
      </form>
    </Container>
  );
}

export default CreatePost;
