import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  // Logout function to handle user logout
  const handleLogout = async () => {
    // Assuming you're removing the token from localStorage and logging out
    localStorage.removeItem("token"); // Remove token from local storage
    navigate("/login");
  };

  return (
    <header className="text-black py-4 px-6 flex justify-between items-center">
      {/* Left side - Blog name */}
      <h1 className="text-xl font-bold">Blog Post</h1>

      {/* Right side - Logout link */}
      <button
        onClick={() => navigate("/posts/create")}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
      >
        Create Post
      </button>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>
    </header>
  );
}

export default Header;
