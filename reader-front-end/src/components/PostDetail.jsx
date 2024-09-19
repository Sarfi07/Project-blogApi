import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DOMPurify from "dompurify";

function PostDetail() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentError, setCommentError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem("token");
        // Fetch post details
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/reader/posts/${postId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Post not found");
        }
        const data = await response.json();
        setUser(data.user);
        setPost(data.post);

        // Fetch comments for the post
        const commentResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/reader/posts/${postId}/comments`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const commentsData = await commentResponse.json();
        setComments(commentsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  // Handle comment submission
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    setCommentError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/reader/posts/${postId}/comments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: newComment }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to post comment");
      }

      const comment = await response.json();
      setComments([...comments, comment.comment]);
      setNewComment("");
    } catch (err) {
      setCommentError(err.message);
    }
  };

  // Handle editing a comment
  const handleEditComment = async (commentId) => {
    if (!editedComment.trim()) return; // Prevent submitting empty comments

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/reader/posts/${postId}/comments/${commentId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: editedComment }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update comment");
      }

      const updatedComment = await response.json();
      setComments(
        comments.map((comment) =>
          comment.id === commentId ? updatedComment.comment : comment
        )
      );
      setEditingCommentId(null);
      setEditedComment("");
    } catch (err) {
      setCommentError(err.message);
    }
  };

  // Handle deleting a comment
  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/reader/posts/${postId}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (err) {
      setCommentError(err.message);
    }
  };

  if (loading)
    return <p className="text-center text-gray-500">Loading post details...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!post) return <p className="text-center text-gray-500">No post found.</p>;

  const sanitizedContent = post ? DOMPurify.sanitize(post.content) : "";

  return (
    <div className="max-w-2xl mx-auto p-4">
      <article className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="text-gray-600 mb-4">
          <p>
            <strong className="font-semibold">Author:</strong>{" "}
            {post.author.name}
          </p>
          <p>
            <strong className="font-semibold">Last Updated At:</strong>{" "}
            {new Date(post.updatedAt).toLocaleString()}
          </p>
        </div>
        <hr className="my-4" />
        <p
          className="text-gray-800"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        ></p>
      </article>

      {/* Comment Section */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
        {comments.length > 0 ? (
          <ul className="space-y-4">
            {comments.map((comment) => (
              <li key={comment.id} className="p-4 border rounded-lg bg-gray-50">
                {editingCommentId === comment.id ? (
                  <div>
                    <textarea
                      className="w-full p-2 border rounded"
                      value={editedComment}
                      onChange={(e) => setEditedComment(e.target.value)}
                    />
                    <div className="mt-2 flex space-x-2">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleEditComment(comment.id)}
                      >
                        Save
                      </button>
                      <button
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => setEditingCommentId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-700 mb-2">{comment.content}</p>
                    <p className="text-gray-500 text-sm mb-2">
                      <strong className="font-semibold">Author:</strong>{" "}
                      {comment.author.name} |{" "}
                      <strong className="font-semibold">Created At:</strong>{" "}
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                    {user.id === comment.authorId && (
                      <div className="flex space-x-2">
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                          onClick={() => {
                            setEditingCommentId(comment.id);
                            setEditedComment(comment.content);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No comments yet.</p>
        )}

        {/* Comment Input Box */}
        <form onSubmit={handleSubmitComment} className="mt-6">
          <textarea
            className="w-full p-2 border rounded"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
          />
          <button
            type="submit"
            className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Post Comment
          </button>
          {commentError && <p className="text-red-500 mt-2">{commentError}</p>}
        </form>
      </section>
    </div>
  );
}

export default PostDetail;
