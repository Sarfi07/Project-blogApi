import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function HomePage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    // Fetch posts from backend
    fetch(`${import.meta.env.VITE_BACKEND_URL}/reader/posts`, {
      headers: {
        Authorization: `Bearer ${token} `,
      },
    }) // Replace with your backend URL
      .then((response) => response.json())
      .then((data) => setPosts(data.posts))
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Posts</h1>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.id} className="bg-white shadow-md rounded-lg p-4">
            {/* Link to the post detail page */}
            <Link
              to={`/posts/${post.id}`}
              className="text-xl font-semibold text-blue-600 hover:text-blue-800"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;
