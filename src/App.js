import React, { useState } from "react";
import {
  Switch,
  Route,
  Redirect,
  BrowserRouter,
  useParams,
} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./static/css/App.css";

import PreLoginNav from "./components/prelogin/PreloginNav";
import Login from "./components/prelogin/Login";
import Welcome from "./components/prelogin/Welcome";
import TopicDetails from "./components/postlogin/TopicDetails";

import Main from "./components/postlogin/Main";
import UsersPublicProfile from "./components/postlogin/UsersPublicProfile";

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

          <Route exact path={"/main"}>
            <Main />
          </Route>

          <Route path={"/topics/:id"} component={TopicDetails} />

          <Route path={"/:user/public"} component={UsersPublicProfile} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
