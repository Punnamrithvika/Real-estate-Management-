import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRef, useState } from "react";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutUserStart,
  signoutUserSuccess,
  signoutUserFailure,
} from "../redux/user/userSlice.js";
import { Link } from "react-router-dom";

export default function Profile() {
  const { currentUser, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListing, setUserListing] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const apiUrl = `/api/user/update/${currentUser._id}`;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      };
      const res = await fetch(apiUrl, options);
      const data = await res.json();
      if (data.success) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const onHandleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const apiUrl = `/api/user/delete/${currentUser._id}`;
      const options = {
        method: "DELETE",
      };
      const res = await fetch(apiUrl, options);
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const onHandleSignout = async (e) => {
    e.preventDefault();
    try {
      dispatch(signoutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signoutUserFailure(data.message));
      } else {
        dispatch(signoutUserSuccess(data));
      }
    } catch (error) {
      dispatch(signoutUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`/api/user/listing/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      }
      setShowListingError(false);
      setUserListing(data);
    } catch (error) {
      setShowListingError(true);
    }
  };

  const onHandleDeleteListing = async (listingId) => {
    try {
      const apiUrl = `/api/listing/delete/${listingId}`;
      const options = {
        method: "DELETE",
      };
      const res = await fetch(apiUrl, options);
      const data = await res.json();
      if (data.success === false) {
        console.log("error occurred");
      }
      console.log("Successfully deleted");
      setUserListing((prevListings) =>
        prevListings.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>
      <form
        onSubmit={onSubmitForm}
        className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md"
      >
        <input type="file" ref={fileRef} hidden />
        <div className="flex flex-col items-center">
          <img
            onClick={() => fileRef.current.click()}
            alt="avatar"
            src={currentUser.avatar}
            accept="image"
            className="h-20 w-20 rounded-full cursor-pointer border-2 border-gray-300"
          />
        </div>
        <input
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={currentUser.username}
          onChange={handleChange}
          className="w-full p-2 border rounded-md mt-4"
        />
        <input
          type="text"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.email}
          onChange={handleChange}
          className="w-full p-2 border rounded-md mt-4"
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          defaultValue={currentUser.password}
          onChange={handleChange}
          className="w-full p-2 border rounded-md mt-4"
        />
        <button
          className="w-full bg-blue-500 text-white p-2 mt-4 rounded-md hover:bg-blue-600"
        >
          {loading ? "Loading..." : "Update"}
        </button>
      </form>
      <div className="flex flex-col items-center mt-4 space-y-2">
        <Link to={"/create-listing"} className="text-blue-500 hover:underline">
          Create Listing
        </Link>
        <span
          onClick={onHandleDelete}
          className="text-red-500 cursor-pointer hover:underline"
        >
          Delete Account
        </span>
        <span
          onClick={onHandleSignout}
          className="text-gray-500 cursor-pointer hover:underline"
        >
          Sign Out
        </span>
      </div>
      {updateSuccess && (
        <p className="text-green-500 mt-2">User Updated Successfully</p>
      )}
      <button
        type="button"
        onClick={handleShowListings}
        className="bg-gray-800 text-white p-2 mt-4 rounded-md hover:bg-gray-900"
      >
        Show Listings
      </button>
      {showListingError && <p className="text-red-500">Error occurred</p>}
       
      {userListing.length > 0 && (
        <div className="mt-6 w-full max-w-2xl">
          <h1 className="text-xl font-semibold mb-4">Your Listings</h1>
          {userListing.map((listing) => (
            <div key={listing._id} className="flex items-center space-x-4 p-4 border rounded-md mb-4">
              <Link to={`/listing/${listing._id}`} className="flex-shrink-0">
                <img
                  src={listing.imageUrls[0]}
                  alt="home"
                  className="h-16 w-16 object-cover rounded-md"
                />
              </Link>
              <div className="flex-1">
                <Link
                  to={`/listing/${listing._id}`}
                  className="text-lg font-semibold hover:underline"
                >
                  {listing.name}
                </Link>
              </div>
              <button
                type="button"
                onClick={() => onHandleDeleteListing(listing._id)}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
              >
                Delete
              </button>
              <Link to={`/update-listing/${listing._id}`}>
                <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">
                  Edit
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
