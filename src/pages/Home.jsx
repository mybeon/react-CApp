import React, { useContext } from "react";
import Container from "../components/Container";
import HomeFeed from "../components/HomeFeed";
import HomeSignUp from "../components/HomeSignUp";
import { StateContext } from "../context";

export default function Home() {
  const appState = useContext(StateContext);
  return (
    <Container wide={true} title={appState.loggedIn ? "Feed" : "Welcome"}>
      {appState.loggedIn ? <HomeFeed /> : <HomeSignUp />}
    </Container>
  );
}
