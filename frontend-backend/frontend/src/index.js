import { createHashHistory } from "history";
import { Router, Route } from "react-router";
import React from "react";
import "./index.css";
// import Main from './views/main';
// import SignIn from './views/signin';
import { render } from "@testing-library/react";
import App from "./views/App";

const hashHistory = createHashHistory();
render(
  <Router history={hashHistory}>
    <div>
      <Route path="/" component={App} />
    </div>
  </Router>,
  document.querySelector("#root")
);

// <Route path = "/login" component = {SignIn}/>
// <Route path = "/main" component = {Main}/>
