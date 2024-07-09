import React from "react";
import "./global.css";
import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "./components/Landing";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import PrivateRoute from "./components/ProtectedRoute";
import Logout from "./components/Logout";
import CreateSubreddit from "./components/CreateSubreddits";
import SearchSubreddits from "./components/SearchSubreddits";
import SubredditPage from "./components/SubredditPage";
import PostDetails from "./components/PostDetails";
import Profile from "./components/ProfilePage";
import Navbar from "./components/Navbar";
function App() {
  return (
    <div>
      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<PrivateRoute component={Home} />} />
            <Route
              path="/createsubreddit"
              element={<PrivateRoute component={CreateSubreddit} />}
            />
            <Route
              path="/search"
              element={<PrivateRoute component={SearchSubreddits} />}
            />
            <Route
              path="/subreddits/:name"
              element={<PrivateRoute component={SubredditPage} />}
            />
            <Route
              path="/posts/:postId"
              element={<PrivateRoute component={PostDetails} />}
            />
            <Route
              path="/profile"
              element={<PrivateRoute component={Profile} />}
            />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
