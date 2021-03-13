import React, { useState } from "react";
import {
  Switch,
  Route,
  BrowserRouter,
} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./static/css/App.css";

import PreLoginNav from "./components/prelogin/PreloginNav";
import Login from "./components/prelogin/Login";
import Welcome from "./components/prelogin/Welcome";
import TopicDetails from "./components/postlogin/TopicDetails";

import Main from "./components/postlogin/Main";
import UsersPublicProfile from "./components/postlogin/UsersPublicProfile";
import EditProfile from "./components/postlogin/EditProfile";
import Posts from "./components/postlogin/Posts";
import PublicTopics from "./components/postlogin/PublicTopics";

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

          <Route path={"/public/"} component={PublicTopics} />

          <Route path={"/board/:boardID"} component={Posts} />

          <Route path={"/:userID/public"} component={UsersPublicProfile} />

          <Route path={"/:userID/edit-profile"} component={EditProfile} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
