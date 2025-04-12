import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { useWishlist } from '../WishlistContext';
import { FaHeart } from 'react-icons/fa';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";

export default function Listing() {
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [copied, setCopied] = useState(false);
  const { addToWishlist } = useWishlist();
  const [isSetWishList, setWishList] = useState(false);
  const navigate = useNavigate();

  const USD_TO_INR = 83;

  const formatINR = (amount) => {
    return amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });
  };

  const handleWishList = () => {
    addToWishlist(listing);
    setWishList(!isSetWishList);
  };

  const onHandleAppointment = () => {
    navigate('/appointment');
  };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
          return;
        }
        setListing(data);
      } catch (error) {
        console.error("Error fetching listing:", error);
      }
    };
    fetchListing();
  }, [params.listingId]);

  if (!listing) {
    return <p className="text-center mt-10">Loading listing details...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 relative">
      <div>
        {/* Swiper Section */}
        <Swiper navigation modules={[Navigation]} className="rounded-lg overflow-hidden relative">
          {listing.imageUrls.map((url, index) => (
            <SwiperSlide key={index}>
              <div
                className="h-64 md:h-96 bg-cover bg-center"
                style={{ backgroundImage: `url(${url})` }}
              ></div>
            </SwiperSlide>
          ))}

          {/* Wishlist Button */}
          <button
            onClick={handleWishList}
            className={`absolute top-4 right-4 z-10 p-2 rounded-full transition ${
              isSetWishList ? 'bg-red-500 text-white' : 'bg-gray-200 text-red-500'
            }`}
          >
            <FaHeart className="text-lg" />
          </button>
        </Swiper>

        {/* Share Button */}
        <div className="flex justify-end items-center space-x-4 mt-2 pr-2">
          <FaShare
            className="cursor-pointer text-gray-500 hover:text-gray-700 text-xl"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
          />
        </div>
        {copied && <p className="text-green-500 text-sm text-center">Link copied!</p>}

        {/* Details Card */}
        <div className="p-4 bg-white shadow-md rounded-lg mt-4">
          <h2 className="text-2xl font-bold">{listing.name}</h2>
          <p className="text-lg text-gray-700">
            {formatINR(listing.regularPrice * USD_TO_INR)}
            {listing.type === "rent" && " / month"}
          </p>

          <p className="flex items-center text-gray-600 mt-2">
            <FaMapMarkerAlt className="mr-2 text-red-500" /> {listing.address}
          </p>

          {listing.locationLink && (
            <div className="mt-2">
              <a
                href={listing.locationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-red-500 text-white px-4 py-2 rounded"
              >
                Locate
              </a>
            </div>
          )}

          <div className="flex space-x-4 mt-4">
            <span className={`px-3 py-1 text-white rounded-md ${listing.type === "rent" ? "bg-blue-500" : "bg-green-500"}`}>
              {listing.type === "rent" ? "For Rent" : "For Sale"}
            </span>
            {listing.offer && (
              <span className="px-3 py-1 bg-yellow-400 text-white rounded-md">
                {formatINR((listing.regularPrice - listing.discountPrice) * USD_TO_INR)} OFF
              </span>
            )}
          </div>

          <p className="mt-4 text-gray-700">
            <span className="font-semibold">Description:</span> {listing.description}
          </p>

          <ul className="mt-4 space-y-2">
            <li className="flex items-center">
              <FaBed className="mr-2 text-blue-500" /> {listing.bedrooms} {listing.bedrooms > 1 ? "beds" : "bed"}
            </li>
            <li className="flex items-center">
              <FaBath className="mr-2 text-blue-500" /> {listing.bathrooms} {listing.bathrooms > 1 ? "baths" : "bath"}
            </li>
            <li className="flex items-center">
              <FaParking className="mr-2 text-blue-500" /> {listing.parking ? "Parking spot" : "No Parking"}
            </li>
            <li className="flex items-center">
              <FaChair className="mr-2 text-blue-500" /> {listing.furnished ? "Furnished" : "Unfurnished"}
            </li>
          </ul>
        </div>

        {/* Book Appointment */}
        <div className="flex justify-center">
          <button
            onClick={onHandleAppointment}
            className="mt-6 w-500 bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600 transition"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
}
