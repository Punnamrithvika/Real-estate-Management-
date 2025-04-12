import React from 'react'
import { Link } from 'react-router-dom'
import { MdLocationOn } from 'react-icons/md'
import { useWishlist } from '../WishlistContext'
import { FaTrash } from 'react-icons/fa' 
export default function WishListItem ({ listing }) {
  const {removeFromWishlist}=useWishlist()
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden p-4"> 
      <Link to={`/listing/${listing._id}`}>
        <img src={listing.imageUrls[0]} alt="home" className="w-full h-48 object-cover rounded-md" />
        <div className="p-3">
          <p className="text-gray-700 font-semibold text-lg truncate">{listing.name}</p>
          <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
            <MdLocationOn className="text-red-500" />
            <p className="truncate">{listing.address}</p>
          </div>
          <p className="text-gray-600 text-sm mt-2 truncate">{listing.description}</p>
          <p className="text-lg font-bold text-blue-500 mt-2">
            Rs: {listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
            {listing.type === 'rent' && '/month'}
          </p>
          <div className="flex space-x-4 text-gray-600 text-sm mt-2">
            <p>{listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}</p>
            <p>{listing.bathrooms > 1 ? `${listing.bathrooms} bathrooms` : `${listing.bathrooms} bathroom`}</p>
          </div>
        </div>
       
      </Link>
      <button 
        onClick={() => removeFromWishlist(listing._id)}
        className="p-2 rounded-full bg-red-500 hover:bg-red-600 transition"
      >
        <FaTrash className="text-white text-md" />
      </button>
    </div>
  )
}