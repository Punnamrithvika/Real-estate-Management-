import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <div className="flex justify-between items-center px-4 py-2 bg-white shadow-md">
      <Link to="/">
        <h1 className="text-2xl font-bold">
          <span className="text-blue-500">Real</span>
          <span className="text-blue-700">Estate</span>
        </h1>
      </Link>
      <form onSubmit={handleSubmit} className="flex items-center border rounded-lg overflow-hidden">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 outline-none w-40 sm:w-64"
        />
        <button className="bg-blue-500 text-white p-2">
          <FaSearch />
        </button>
      </form>
      <ul className="flex space-x-4 items-center">
        <Link to="/">
          <li className="hover:text-blue-500">Home</li>
        </Link>
        <Link to="/about">
          <li className="hover:text-blue-500">About</li>
        </Link>
        <Link to="/search">
          <li className="hover:text-blue-500">Explore</li>
        </Link>
        <Link to="/create-listing">
          <li className="hover:text-blue-500">Add Property</li>
        </Link>
        <Link to="/wishlist">
        <li className="hover:text-blue-500">Wish List</li>
        </Link>
        <Link to="/profile">
          {!currentUser ? (
            <li className="hover:text-blue-500">Sign In</li>
          ) : (
            <img
              alt="avatar"
              src={currentUser.avatar}
              className="h-8 w-8 rounded-full border"
            />
          )}
        </Link>
      </ul>
    </div>
  );
}
