import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const FeedPage = () => {
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/user/feed", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFeed(response.data);
      } catch (error) {
        console.error("Error fetching feed:", error);
      }
    };

    fetchFeed();
  }, []);

  return (
    <div className="bg-white p-6 rounded shadow-md mt-6">
      <h1 className="text-2xl font-bold mb-4">Your Feed</h1>
      <ul className="space-y-4">
        {feed.map((post) => (
          <li key={post.id} className="border-b pb-4">
            <Link
              to={`/posts/${post.id}`}
              className="text-blue-500 hover:underline"
            >
              {post.title}{" "}
              <span className="text-gray-500">(in {post.subreddit_name})</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeedPage;
