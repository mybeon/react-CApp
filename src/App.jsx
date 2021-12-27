import React, { useEffect, useRef, Suspense, lazy } from "react";
import Home from "./pages/Home";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FlashMessage from "./components/FlashMessage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { StateContext, DispatchContext } from "./context";
import { useImmerReducer } from "use-immer";
import axios from "axios";
import "./main.css";
import Profile from "./pages/Profile";
import EditPost from "./pages/EditPost";
import NotFound from "./pages/NotFound";
import { CSSTransition } from "react-transition-group";
import Loading from "./components/Loading";

const CreatePost = lazy(() => import("./pages/CreatePost"));
const SinglePost = lazy(() => import("./pages/SinglePost"));
const Search = lazy(() => import("./components/Search"));
const Chat = lazy(() => import("./components/Chat"));

axios.defaults.baseURL = process.env.BASEURL || "https://backendnode-react.herokuapp.com";

function App() {
  const nodeRef = useRef(null);
  const token = JSON.parse(localStorage.getItem("user"))?.token;

  const initialState = {
    loggedIn: Boolean(token),
    flashMessages: [],
    user: JSON.parse(localStorage.getItem("user")),
    isSearchOpen: false,
    isChatOpen: false,
    unReadChatCount: 0,
  };

  function reducer(state, action) {
    switch (action.type) {
      case "login":
        state.user = action.data;
        state.loggedIn = true;
        break;
      case "logout":
        state.loggedIn = false;
        break;
      case "flashMessage":
        state.flashMessages.push(action.value);
        break;
      case "openSearch":
        state.isSearchOpen = true;
        break;
      case "closeSearch":
        state.isSearchOpen = false;
        break;

      case "toggleChat":
        state.isChatOpen = !state.isChatOpen;
        break;
      case "closeChat":
        state.isChatOpen = false;
        break;
      case "incrementUnreadChatCount":
        state.unReadChatCount++;
        break;
      case "clearUnreadChatCount":
        state.unReadChatCount = 0;
        break;
      default:
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, initialState);

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("user", JSON.stringify(state.user));
    } else {
      localStorage.removeItem("user");
    }
  }, [state.loggedIn, state.user]);

  useEffect(() => {
    if (state.loggedIn) {
      const request = axios.CancelToken.source();
      axios
        .post("/checkToken", { token: state.user.token }, { cancelToken: request.token })
        .then((res) => {
          if (!res.data) {
            dispatch({ type: "logout" });
            dispatch({ type: "flashMessage", value: "please, sign in again." });
          }
        })
        .catch(() => {});
      return () => request.cancel();
    }
  }, []);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <Router>
          <FlashMessage flashMessage={state.flashMessages} />
          <Header />
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about-us" element={<About />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/post/:id" element={<SinglePost />} />
              <Route path="/post/:id/edit" element={<EditPost />} />
              <Route path="/profile/:username/*" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <CSSTransition nodeRef={nodeRef} timeout={330} in={state.isSearchOpen} classNames="search-overlay" unmountOnExit>
            <div ref={nodeRef} className="search-overlay">
              <Suspense fallback="">
                <Search nodeRef={nodeRef} />
              </Suspense>
            </div>
          </CSSTransition>
          <Suspense fallback="">{state.loggedIn && <Chat />}</Suspense>
          <Footer />
        </Router>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export default App;
