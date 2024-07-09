import React from "react";
import { Link } from "react-router-dom";
import FeedPage from "./Feedpage";

function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Home</h1>
          <nav className="mt-4">
            <ul className="flex space-x-4">
              <li>
                <Link
                  to="/createsubreddit"
                  className="text-blue-500 hover:underline"
                >
                  Create Subreddit
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-blue-500 hover:underline">
                  Search Subreddits
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        <FeedPage />
      </main>
    </div>
  );
}

export default Home;
