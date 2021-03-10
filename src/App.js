import React, { useState } from "react";
import { Switch, Route, Redirect, BrowserRouter } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./static/css/App.css";

import PreLoginNav from "./components/prelogin/PreloginNav";
import Login from "./components/prelogin/Login";
import Welcome from "./components/prelogin/Welcome";

import Main from './components/postlogin/Main'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter basename="/">
      <div className="App">
        <Switch>
          <Route exact path={"/"}>
            <PreLoginNav />
            <Welcome />
          </Route>

          <Route exact path={"/login"}>
            <PreLoginNav />
            <Login />
          </Route>

          <Route exact path={"/landing"}>
            <Main />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
