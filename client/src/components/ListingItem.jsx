import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import { useWishlist } from '../WishlistContext';
import { FaHeart } from 'react-icons/fa';

export default function ListingItem({ listing }) {
  const { addToWishlist } = useWishlist();
  const [isSetWishList, setWishList] = useState(false);
  const navigate = useNavigate();

  const handleWishList = () => {
    addToWishlist(listing);
    setWishList(!isSetWishList);
  };

  const onHandleAppointment = () => {
    navigate('/appointment');
  };

  listing.discountPrice=Number(listing.discountPrice)*20
  listing.regularPrice=Number(listing.regularPrice)*20

  return (
    <div className="relative bg-white shadow-md rounded-lg overflow-hidden p-4">
      {/* Wishlist Icon */}
      <button
        onClick={handleWishList}
        className={`absolute top-4 right-4 p-2 rounded-full transition ${
          isSetWishList ? 'bg-red-500 text-white' : 'bg-gray-200 text-red-500'
        }`}
      >
        <FaHeart className="text-lg" />
      </button>

      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0]}
          alt="home"
          className="w-full h-48 object-cover rounded-md"
        />
        <div className="p-3">
          <p className="text-gray-700 font-semibold text-lg truncate">
            {listing.name}
          </p>
          <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
            <MdLocationOn className="text-red-500" />
            <p className="truncate">{listing.address}</p>
          </div>
          <p className="text-gray-600 text-sm mt-2 truncate">{listing.description}</p>
          <p className="text-lg font-bold text-blue-500 mt-2">
             Rs:
            {listing.offer
              ? listing.discountPrice.toLocaleString('en-IN')
              : listing.regularPrice.toLocaleString('en-IN')}
            {listing.type === 'rent' && '/month'}
          </p>
          <div className="flex space-x-4 text-gray-600 text-sm mt-2">
            <p>{listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}</p>
            <p>{listing.bathrooms > 1 ? `${listing.bathrooms} bathrooms` : `${listing.bathrooms} bathroom`}</p>
          </div>
        </div>
      </Link>

      <div className="mt-4">
        <button
          onClick={onHandleAppointment}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
}
