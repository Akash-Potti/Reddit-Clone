import React, { useState, useEffect } from "react";
import axios from "axios";

function Subreddits() {
  const [subreddits, setSubreddits] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchSubreddits();
  }, []);

  const fetchSubreddits = async () => {
    try {
      const response = await axios.get("http://localhost:5000/subreddits");
      setSubreddits(response.data);
    } catch (err) {
      console.log(err);
      console.log("Error fetching subreddits");
    }
  };

  const handleCreateSubreddit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    console.log("Token:", token);
    try {
      await axios.post(
        "http://localhost:5000/subreddits",
        { name, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchSubreddits();
      setName("");
      setDescription("");
    } catch (error) {
      console.error("Error creating subreddit:", error);
      alert("Error creating subreddit");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create Subreddit</h1>
      <form
        onSubmit={handleCreateSubreddit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Subreddit Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            placeholder="Subreddit Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}

export default Subreddits;
