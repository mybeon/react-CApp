import React, { useContext } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { DispatchContext } from "../context";

function HeaderOut() {
  const appDispatch = useContext(DispatchContext);
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().max(30, "username must be less than 30").min(3, "username must be 3 characters at least").required("required"),
      password: Yup.string().min(12).max(30).required("required"),
    }),
    onSubmit: (values) => {
      axios
        .post("/login", values)
        .then((res) => {
          if (res.data) {
            appDispatch({ type: "login", data: res.data });
            appDispatch({ type: "flashMessage", value: "You are now logged in." });
          } else {
            appDispatch({ type: "flashMessage", value: "incorrect username/password." });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });
  return (
    <form onSubmit={formik.handleSubmit} className="mb-0 pt-2 pt-md-0">
      <div className="row align-items-center">
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input
            value={formik.values.username}
            onChange={formik.handleChange}
            name="username"
            className="form-control form-control-sm input-dark"
            type="text"
            placeholder="Username"
            autoComplete="off"
          />
        </div>
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input
            value={formik.values.password}
            onChange={formik.handleChange}
            name="password"
            className="form-control form-control-sm input-dark"
            type="password"
            placeholder="Password"
          />
        </div>
        <div className="col-md-auto">
          <button type="submit" className="btn btn-success btn-sm">
            Sign In
          </button>
        </div>
      </div>
    </form>
  );
}

export default HeaderOut;
