import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoutes";
import HomePage from "./components/Index";
import PostDetail from "./components/PostDetail";
import BlogPostForm from "./components/Post_form";
import Signup from "./components/SignUp";
import ErrorPage from "./components/ErrorPage";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/signup" element={<Signup />} />
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
          <Route
            path="/posts/create"
            element={
              <PrivateRoute>
                <BlogPostForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/posts/edit/:postId"
            element={
              <PrivateRoute>
                <BlogPostForm />
              </PrivateRoute>
            }
          />

          {/* Fallback route for unmatched paths */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
