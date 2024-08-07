import React from "react";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Reddit</h1>
      <nav className="flex space-x-4">
        <Link
          to="/register"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Register
        </Link>
        <Link
          to="/login"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Login
        </Link>
      </nav>
    </div>
  );
}

export default Landing;
