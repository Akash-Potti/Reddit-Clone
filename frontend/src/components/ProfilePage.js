import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userResponse = await axios.get("http://localhost:5000/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(userResponse.data);

        const postsResponse = await axios.get(
          "http://localhost:5000/profile/posts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPosts(postsResponse.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg">
      {user && (
        <>
          <h1 className="text-3xl font-bold text-blue-500 mb-4">
            {user.username}'s Profile
          </h1>
          <p className="text-gray-700 mb-8">Email: {user.email}</p>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Your Posts
          </h2>
          <ul className="space-y-4">
            {posts.map((post) => (
              <li key={post.id} className="bg-gray-100 p-4 rounded-lg">
                <Link
                  to={`/posts/${post.id}`}
                  className="text-blue-500 hover:underline"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
