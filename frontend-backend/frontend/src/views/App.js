import React, { Component } from "react";
import store from "../store";
import SignIn from "./signin";
import Main from "./main";

class App extends Component {
  componentDidMount() {
    store.registerComponent("App", this);
  }
  componentWillUnmount() {
    store.unregisterComponent("App", this);
  }
  render() {
    if (store.getData.GetLogin() === 0) {
      return <SignIn></SignIn>;
    }
    if (store.getData.GetLogin() === 1) {
      return <Main></Main>;
    }
  }
}

export default App;
