import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const PostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContext, setCommentContext] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem("token");
        const postResponse = await axios.get(
          `http://localhost:5000/posts/${postId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPost(postResponse.data);

        const commentsResponse = await axios.get(
          `http://localhost:5000/posts/${postId}/comments`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setComments(commentsResponse.data);
      } catch (error) {
        console.error("Error fetching post or comments:", error);
      }
    };

    fetchPost();
  }, [postId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/posts/${postId}/comments`,
        { context: commentContext },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const commentsResponse = await axios.get(
        `http://localhost:5000/posts/${postId}/comments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments(commentsResponse.data);
      setCommentContext("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg">
      {post && (
        <>
          <h1 className="text-3xl font-bold text-blue-500 mb-4">
            {post.title}
          </h1>
          <p className="text-gray-700 mb-8">{post.context}</p>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Comments
          </h2>
          <form onSubmit={handleAddComment} className="mb-8">
            <textarea
              className="w-full p-2 border border-gray-300 rounded-lg mb-2"
              placeholder="Add a comment"
              value={commentContext}
              onChange={(e) => setCommentContext(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Add Comment
            </button>
          </form>
          <ul className="space-y-4">
            {comments.map((comment) => (
              <li key={comment.id} className="bg-gray-100 p-4 rounded-lg">
                <strong className="text-gray-800">{comment.username}</strong>:{" "}
                <span className="text-gray-700">{comment.context}</span>
                <br />
                <small className="text-gray-500">
                  {new Date(comment.created_at).toLocaleString()}
                </small>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default PostPage;
