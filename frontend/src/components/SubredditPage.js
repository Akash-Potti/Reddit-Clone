import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const SubredditPage = () => {
  const { name } = useParams();
  const [subreddit, setSubreddit] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [title, setTitle] = useState("");
  const [context, setContext] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");

  useEffect(() => {
    const fetchSubreddit = async () => {
      try {
        const token = localStorage.getItem("token");
        const subredditResponse = await axios.get(
          `http://localhost:5000/subreddits/${name}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSubreddit(subredditResponse.data);

        const postsResponse = await axios.get(
          `http://localhost:5000/subreddits/${name}/posts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPosts(postsResponse.data);

        const followStatusResponse = await axios.get(
          `http://localhost:5000/subreddits/${subredditResponse.data.id}/follow-status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsFollowing(followStatusResponse.data.isFollowing);
      } catch (error) {
        console.error("Error fetching subreddit or posts:", error);
      }
    };

    fetchSubreddit();
  }, [name]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/subreddits/${name}/posts`,
        { title, context, media_url: mediaUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Fetch posts again to include the new post
      const postsResponse = await axios.get(
        `http://localhost:5000/subreddits/${name}/posts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPosts(postsResponse.data);
      setTitle("");
      setContext("");
      setMediaUrl("");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleFollow = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/subreddits/${subreddit.id}/follow`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsFollowing(true);
    } catch (error) {
      console.error("Error following subreddit:", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/subreddits/${subreddit.id}/unfollow`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsFollowing(false);
    } catch (error) {
      console.error("Error unfollowing subreddit:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {subreddit && (
        <>
          <div className="bg-white p-6 rounded shadow-md mb-6">
            <h1 className="text-3xl font-bold mb-2">{subreddit.name}</h1>
            <p className="text-gray-700 mb-4">{subreddit.description}</p>
            {isFollowing ? (
              <button
                onClick={handleUnfollow}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Unfollow
              </button>
            ) : (
              <button
                onClick={handleFollow}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Follow
              </button>
            )}
          </div>
          <form
            onSubmit={handleCreatePost}
            className="bg-white p-6 rounded shadow-md mb-6"
          >
            <h2 className="text-2xl font-bold mb-4">Create a Post</h2>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-2 mb-4 border rounded"
            />
            <textarea
              placeholder="Context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              required
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="text"
              placeholder="Media URL (optional)"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Create Post
            </button>
          </form>
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-2xl font-bold mb-4">Posts</h2>
            <ul className="space-y-4">
              {posts.map((post) => (
                <li key={post.id} className="border-b pb-4">
                  <Link
                    to={`/posts/${post.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default SubredditPage;
