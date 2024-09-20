import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import Header from "./Header";

const BlogPostForm = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (postId) {
      // Fetch post data for editing
      const fetchPost = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/author/posts/${postId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          setTitle(data.post.title);
          setContent(data.post.content);
        } catch (error) {
          console.error("Error fetching post:", error);
        }
      };

      fetchPost();
    }
  }, [postId]);

  const handleEditorChange = (content) => {
    setContent(content);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = {
      title,
      content: content.replace(/<\/?p>/g, ""),
    };

    try {
      const token = localStorage.getItem("token");
      if (postId) {
        console.log(postData);
        // Update post
        await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/author/posts/${postId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(postData),
          }
        );
      } else {
        // Create new post
        await fetch("${import.meta.env.VITE_BACKEND_URL}/author/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(postData),
        });
      }
      navigate("/"); // Redirect to home or post list page
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
      <Header />
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        {postId ? "Edit Post" : "Create a New Blog Post"}
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Title Field */}
        <div className="mb-5">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="title"
          >
            Title:
          </label>
          <input
            type="text"
            id="title"
            className="border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* TinyMCE Editor for Content */}
        <div className="mb-5">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="content"
          >
            Content:
          </label>
          <div className="border border-gray-300 rounded-lg">
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
              value={content}
              init={{
                height: 300,
                menubar: false,
                plugins: [
                  "advlist autolink lists link image charmap print preview anchor",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table paste code help wordcount",
                ],
                toolbar:
                  "undo redo | formatselect | bold italic backcolor | \
                alignleft aligncenter alignright alignjustify | \
                bullist numlist outdent indent | removeformat | help",
                formats: {
                  // Customize how TinyMCE formats content
                  // Remove default paragraph wrapping if needed
                  paragraph: {
                    selector: "p",
                    block: true,
                    styles: {
                      // Add custom styles if necessary
                    },
                  },
                },
              }}
              onEditorChange={handleEditorChange}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            {postId ? "Update Post" : "Submit Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogPostForm;
