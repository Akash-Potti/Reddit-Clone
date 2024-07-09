import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SubredditCard from "./SubredditCard";

const SearchSubreddit = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/subreddits/search/${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSearchResults(response.data);
      setError("");
    } catch (error) {
      console.log(error);
      setError("Error fetching subreddits");
    }
  };

  const handleSubredditClick = (name) => {
    navigate(`/subreddits/${name}`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white p-6 rounded shadow-md mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter subreddit name"
          className="w-full p-2 border rounded mb-4"
        />
        <button
          onClick={handleSearch}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          Search
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
      {searchResults.length > 0 && (
        <div className="bg-white p-6 rounded shadow-md">
          <h3 className="text-2xl font-bold mb-4">Search Results:</h3>
          <ul className="space-y-4">
            {searchResults.map((subreddit) => (
              <li key={subreddit.id}>
                <SubredditCard
                  name={subreddit.name}
                  description={subreddit.description}
                  profileImageUrl={subreddit.profile_image_url}
                  onClick={() => handleSubredditClick(subreddit.name)}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchSubreddit;
