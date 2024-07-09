import React from "react";
import { useNavigate } from "react-router-dom";

const SubredditCard = ({ name, description, profileImageUrl }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/subreddits/${name}`);
  };

  return (
    <div className="flex items-center p-4 bg-white shadow-md rounded-lg cursor-pointer hover:bg-gray-100 transition">
      {profileImageUrl && (
        <img
          src={`http://localhost:5000/${profileImageUrl}`}
          alt={`${name} profile`}
          className="w-16 h-16 rounded-full object-cover mr-4"
        />
      )}
      <div>
        <h3 className="text-lg font-bold text-blue-500">{name}</h3>
        <p className="text-gray-700">{description}</p>
        <button
          onClick={handleClick}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default SubredditCard;
