import React from "react";
import { useNavigate } from "react-router-dom";

const SubredditDetails = ({ name, description, posts }) => {
  const navigate = useNavigate();

  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white p-6 rounded shadow-md mb-6">
        <h1 className="text-3xl font-bold mb-2">{name}</h1>
        <p className="text-gray-700 mb-4">{description}</p>
      </div>
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Posts</h2>
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts yet</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                onClick={() => handlePostClick(post.id)}
                className="cursor-pointer border-b pb-4 hover:bg-gray-100 p-2 rounded"
              >
                <h3 className="text-xl text-blue-500">{post.title}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubredditDetails;
