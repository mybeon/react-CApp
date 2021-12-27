import React, { useContext, useRef, useEffect } from "react";
import { StateContext, DispatchContext } from "../context";
import { useImmer } from "use-immer";
import { motion } from "framer-motion";
import io from "socket.io-client";
import { Link } from "react-router-dom";

function Chat() {
  const socket = useRef(null);
  const chatField = useRef(null);
  const chatLog = useRef(null);
  const { user, isChatOpen } = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const [state, setState] = useImmer({
    fieldValue: "",
    chatMessages: [],
  });

  function handleFieldChange(e) {
    const value = e.target.value;
    setState((draft) => {
      draft.fieldValue = value;
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    socket.current.emit("chatFromBrowser", {
      message: state.fieldValue,
      token: user.token,
    });

    setState((draft) => {
      draft.chatMessages.push({
        message: draft.fieldValue,
        username: user.username,
        avatar: user.avatar,
      });
      draft.fieldValue = "";
    });
  }

  useEffect(() => {
    if (isChatOpen) {
      chatField.current.focus();
      appDispatch({ type: "clearUnreadChatCount" });
    }
  }, [isChatOpen]);

  useEffect(() => {
    chatLog.current.scrollTop = chatLog.current.scrollHeight;

    if (state.chatMessages.length && !isChatOpen) {
      appDispatch({ type: "incrementUnreadChatCount" });
    }
  }, [state.chatMessages]);

  useEffect(() => {
    const url = process.env.BASEURL || "https://backendnode-react.herokuapp.com";
    socket.current = io(url);
    socket.current.on("chatFromServer", (message) => {
      setState((draft) => {
        draft.chatMessages.push(message);
      });
    });

    return () => socket.current.disconnect();
  }, []);

  return (
    <div id="chat-wrapper" className={"chat-wrapper shadow border-top border-left border-right " + (isChatOpen ? "chat-wrapper--is-visible" : "")}>
      <div className="chat-title-bar bg-primary">
        Chat
        <span onClick={() => appDispatch({ type: "closeChat" })} className="chat-title-bar-close">
          <i className="fas fa-times-circle"></i>
        </span>
      </div>
      <div ref={chatLog} id="chat" className="chat-log">
        {state.chatMessages.map((message, index) => {
          if (message.username === user.username) {
            return (
              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} key={index} className="chat-self">
                <div className="chat-message">
                  <div className="chat-message-inner">{message.message}</div>
                </div>
                <img alt="profile chat" className="chat-avatar avatar-tiny" src={message.avatar} />
              </motion.div>
            );
          }
          return (
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} key={index} className="chat-other">
              <Link to={`/profile/${message.username}`}>
                <img alt="profile chat" className="avatar-tiny" src={message.avatar} />
              </Link>
              <div className="chat-message">
                <div className="chat-message-inner">
                  <Link to={`/profile/${message.username}`}>
                    <strong>{message.username}: </strong>
                  </Link>
                  {message.message}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      <form onSubmit={handleSubmit} id="chatForm" className="chat-form border-top">
        <input
          value={state.fieldValue}
          onChange={handleFieldChange}
          ref={chatField}
          type="text"
          className="chat-field"
          id="chatField"
          placeholder="Type a message…"
          autoComplete="off"
        />
      </form>
    </div>
  );
}

export default Chat;
