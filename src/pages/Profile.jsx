import React, { useEffect, useContext } from "react";
import Container from "../components/Container";
import axios from "axios";
import { useParams, NavLink, Route, Routes } from "react-router-dom";
import { StateContext } from "../context";
import PostProfile from "../components/PostProfile";
import { useImmer } from "use-immer";
import FollowProfile from "../components/FollowProfile";

function Profile() {
  const { loggedIn, user } = useContext(StateContext);
  const { username } = useParams();
  const [state, setState] = useImmer({
    followActionLoading: false,
    startFollowingRequestCount: 0,
    stopFollowingRequestCount: 0,
    profileData: {
      profileUsername: "...",
      profileAvatar: "http://www.gravatar.com/avatar/?d=mp",
      isFollowing: false,
      counts: {
        postCount: "",
        followingCount: "",
        followerCount: "",
      },
    },
  });
  useEffect(() => {
    const ourRequest = axios.CancelToken.source();
    (() => {
      axios
        .post(`/profile/${username}`, { token: user?.token }, { cancelToken: ourRequest.token })
        .then((res) => {
          setState((draft) => {
            draft.profileData = res.data;
          });
        })
        .catch(() => {
          console.log("error");
        });
    })();
    return () => {
      ourRequest.cancel();
    };
  }, [username, setState]);

  useEffect(() => {
    if (state.startFollowingRequestCount) {
      setState((draft) => {
        draft.followActionLoading = true;
      });
      const ourRequest = axios.CancelToken.source();
      (() => {
        axios
          .post(`/addFollow/${state.profileData.profileUsername}`, { token: user.token }, { cancelToken: ourRequest.token })
          .then((res) => {
            setState((draft) => {
              draft.profileData.isFollowing = true;
              draft.profileData.counts.followerCount++;
              draft.followActionLoading = false;
            });
          })
          .catch(() => {
            console.log("error");
          });
      })();
      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.startFollowingRequestCount, setState, state.profileData.profileUsername]);

  useEffect(() => {
    if (state.stopFollowingRequestCount) {
      setState((draft) => {
        draft.followActionLoading = true;
      });
      const ourRequest = axios.CancelToken.source();
      (() => {
        axios
          .post(`/removeFollow/${state.profileData.profileUsername}`, { token: user.token }, { cancelToken: ourRequest.token })
          .then((res) => {
            setState((draft) => {
              draft.profileData.isFollowing = false;
              draft.profileData.counts.followerCount--;
              draft.followActionLoading = false;
            });
          })
          .catch(() => {
            console.log("error");
          });
      })();
      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.stopFollowingRequestCount, setState, state.profileData.profileUsername]);

  function startFollowing() {
    setState((draft) => {
      draft.startFollowingRequestCount++;
    });
  }

  function stopFollowing() {
    setState((draft) => {
      draft.stopFollowingRequestCount++;
    });
  }

  return (
    <Container title="Profile">
      <h2>
        <img className="avatar-small" alt="profile avatar" src={state.profileData.profileAvatar} /> {state.profileData.profileUsername}
        {loggedIn &&
          !state.profileData.isFollowing &&
          user.username !== state.profileData.profileUsername &&
          state.profileData.profileUsername !== "..." && (
            <button onClick={startFollowing} disabled={state.followActionLoading} className="btn btn-primary btn-sm ml-2">
              Follow <i className="fas fa-user-plus"></i>
            </button>
          )}
        {loggedIn &&
          state.profileData.isFollowing &&
          user.username !== state.profileData.profileUsername &&
          state.profileData.profileUsername !== "..." && (
            <button onClick={stopFollowing} disabled={state.followActionLoading} className="btn btn-danger btn-sm ml-2">
              Stop following <i className="fas fa-user-times"></i>
            </button>
          )}
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <NavLink end={true} to="" className="nav-item nav-link">
          Posts: {state.profileData.counts.postCount}
        </NavLink>
        <NavLink to="followers" className="nav-item nav-link">
          Followers: {state.profileData.counts.followerCount}
        </NavLink>
        <NavLink to="following" className="nav-item nav-link">
          Following: {state.profileData.counts.followingCount}
        </NavLink>
      </div>

      <Routes>
        <Route path="/" element={<PostProfile username={username} />} />
        <Route path="followers" element={<FollowProfile username={username} type="followers" />} />
        <Route path="following" element={<FollowProfile username={username} type="following" />} />
      </Routes>
    </Container>
  );
}

export default Profile;
