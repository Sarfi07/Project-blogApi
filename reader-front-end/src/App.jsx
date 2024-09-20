// import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import HomePage from "./components/Homepage";
import PrivateRoute from "./components/PrivateRoute";
import PostDetail from "./components/PostDetail";
import Signup from "./components/SignUp";
import ErrorPage from "./components/ErrorPage";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/posts/:postId"
            element={
              <PrivateRoute>
                <PostDetail />
              </PrivateRoute>
            }
          />
          <Route path="/signup" element={<Signup />} />

          {/* Fallback for unmatched paths */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
