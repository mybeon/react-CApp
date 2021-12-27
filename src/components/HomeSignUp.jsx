import React, { useEffect, useContext } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useImmerReducer } from "use-immer";
import { DispatchContext } from "../context";

function HomeSignUp() {
  const appDispatch = useContext(DispatchContext);
  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
  };

  const initialValues = {
    username: {
      value: "",
      hasErrors: false,
      message: "",
      isUnique: false,
      checkCount: 0,
    },
    email: {
      value: "",
      hasErrors: false,
      message: "",
      isUnique: false,
      checkCount: 0,
    },
    password: {
      value: "",
      hasErrors: false,
      message: "",
    },
    submitCount: 0,
  };

  function reducer(draft, action) {
    switch (action.type) {
      case "usernameImmediatly":
        draft.username.hasErrors = false;
        draft.username.value = action.value;
        if (draft.username.value.length > 30) {
          draft.username.hasErrors = true;
          draft.username.message = "Username can be at most 30 charactere";
        }
        if (draft.username.value !== "" && !/^([a-zA-Z0-9]+)$/.test(draft.username.value)) {
          draft.username.hasErrors = true;
          draft.username.message = "Username can only be alphanumeric";
        }
        break;
      case "usernameDelay":
        if (draft.username.value.length < 3) {
          draft.username.hasErrors = true;
          draft.username.message = "Username can be at least 3 charactere";
        }
        if (!draft.username.hasErrors && !action.noReq) {
          draft.username.checkCount++;
        }
        break;
      case "usernameUniqueResults":
        if (action.value) {
          draft.username.hasErrors = true;
          draft.username.isUnique = false;
          draft.username.message = "Username already taken";
        } else {
          draft.username.isUnique = true;
        }
        break;
      case "emailImmediatly":
        draft.email.hasErrors = false;
        draft.email.value = action.value;
        break;
      case "emailDelay":
        if (!/^\S+@\S+\.\S+$/.test(draft.email.value)) {
          draft.email.hasErrors = true;
          draft.email.message = "Must enter a valid email";
        }
        if (!draft.email.hasErrors && !action.noReq) {
          draft.email.checkCount++;
        }
        break;
      case "emailUniqueResults":
        if (action.value) {
          draft.email.hasErrors = true;
          draft.email.isUnique = false;
          draft.email.message = "Email is already taken";
        } else {
          draft.email.isUnique = true;
        }
        break;
      case "passwordImmediatly":
        draft.password.hasErrors = false;
        draft.password.value = action.value;
        if (draft.password.value.length > 50) {
          draft.password.hasErrors = true;
          draft.password.message = "Password can not exceed 50 characteres";
        }
        break;
      case "passwordDelay":
        if (draft.password.value.length < 12) {
          draft.password.hasErrors = true;
          draft.password.message = "Password can be at least 12 charactere";
        }
        break;
      case "submitForm":
        if (!draft.username.hasErrors && draft.username.isUnique && !draft.email.hasErrors && draft.email.isUnique && !draft.password.hasErrors) {
          draft.submitCount++;
        }
        break;
      default:
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, initialValues);

  useEffect(() => {
    if (state.username.value) {
      const delay = setTimeout(() => dispatch({ type: "usernameDelay" }), 800);
      return () => clearTimeout(delay);
    }
  }, [state.username.value, dispatch]);
  useEffect(() => {
    if (state.email.value) {
      const delay = setTimeout(() => dispatch({ type: "emailDelay" }), 800);
      return () => clearTimeout(delay);
    }
  }, [state.email.value, dispatch]);

  useEffect(() => {
    if (state.password.value) {
      const delay = setTimeout(() => dispatch({ type: "passwordDelay" }), 800);
      return () => clearTimeout(delay);
    }
  }, [state.password.value, dispatch]);

  useEffect(() => {
    if (state.username.checkCount) {
      const request = axios.CancelToken.source();
      axios
        .post("/doesUsernameExist", { username: state.username.value }, { cancelToken: request.token })
        .then((res) => {
          dispatch({ type: "usernameUniqueResults", value: res.data });
        })
        .catch(() => {});
      return () => request.cancel();
    }
  }, [state.username.checkCount, dispatch]);

  useEffect(() => {
    if (state.email.checkCount) {
      const request = axios.CancelToken.source();
      axios
        .post("/doesEmailExist", { email: state.email.value }, { cancelToken: request.token })
        .then((res) => {
          dispatch({ type: "emailUniqueResults", value: res.data });
        })
        .catch(() => {});
      return () => request.cancel();
    }
  }, [state.email.checkCount, dispatch]);
  useEffect(() => {
    if (state.submitCount) {
      const request = axios.CancelToken.source();
      axios
        .post(
          "/register",
          { username: state.username.value, email: state.email.value, password: state.password.value },
          { cancelToken: request.token }
        )
        .then((res) => {
          appDispatch({ type: "login", data: res.data });
          appDispatch({ type: "flashMessage", value: "You are now logged in." });
        })
        .catch((e) => console.log(e));
      return () => request.cancel();
    }
  }, [state.submitCount]);

  function handleSubmit(e) {
    e.preventDefault();
    dispatch({ type: "usernameImmediatly", value: state.username.value });
    dispatch({ type: "usernameDelay", value: state.username.value, noReq: true });
    dispatch({ type: "emailImmediatly", value: state.email.value });
    dispatch({ type: "emailDelay", value: state.email.value, noReq: true });
    dispatch({ type: "passwordImmediatly", value: state.password.value });
    dispatch({ type: "passwordDelay", value: state.password.value });
    dispatch({ type: "submitForm" });
  }

  return (
    <div className="row align-items-center">
      <div className="col-lg-7 py-3 py-md-5">
        <h1 className="display-3">Remember Writing?</h1>
        <p className="lead text-muted">
          Are you sick of short tweets and impersonal &ldquo;shared&rdquo; posts that are reminiscent of the late 90&rsquo;s email forwards? We
          believe getting back to actually writing is the key to enjoying the internet again.
        </p>
      </div>
      <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username-register" className="text-muted mb-1">
              <small>Username</small>
            </label>
            <input
              id="username-register"
              name="username"
              className="form-control"
              type="text"
              placeholder="Pick a username"
              autoComplete="off"
              onChange={(e) => dispatch({ type: "usernameImmediatly", value: e.target.value })}
            />
            <AnimatePresence>
              {state.username.hasErrors && (
                <motion.div
                  transition={{ duration: 0.5, ease: "anticipate" }}
                  variants={variants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="alert alert-danger small liveValidateMessage"
                >
                  {state.username.message}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="form-group">
            <label htmlFor="email-register" className="text-muted mb-1">
              <small>Email</small>
            </label>
            <input
              id="email-register"
              name="email"
              className="form-control"
              type="text"
              placeholder="you@example.com"
              autoComplete="off"
              onChange={(e) => dispatch({ type: "emailImmediatly", value: e.target.value })}
            />

            <AnimatePresence>
              {state.email.hasErrors && (
                <motion.div
                  transition={{ duration: 0.5, ease: "anticipate" }}
                  variants={variants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="alert alert-danger small liveValidateMessage"
                >
                  {state.email.message}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="form-group">
            <label htmlFor="password-register" className="text-muted mb-1">
              <small>Password</small>
            </label>
            <input
              id="password-register"
              name="password"
              className="form-control"
              type="password"
              placeholder="Create a password"
              onChange={(e) => dispatch({ type: "passwordImmediatly", value: e.target.value })}
            />
            <AnimatePresence>
              {state.password.hasErrors && (
                <motion.div
                  transition={{ duration: 0.5, ease: "anticipate" }}
                  variants={variants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="alert alert-danger small liveValidateMessage"
                >
                  {state.password.message}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block">
            Sign up for ComplexApp
          </button>
        </form>
      </div>
    </div>
  );
}

export default HomeSignUp;
