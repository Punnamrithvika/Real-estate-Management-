import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

  const handleWishList = () => {
    addToWishlist(listing);
    setWishList(!isSetWishList);
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

  return (
    <div className="max-w-4xl mx-auto p-4">
      {listing && (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <Swiper navigation modules={[Navigation]} className="rounded-lg">
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-64 md:h-96 bg-cover bg-center"
                  style={{ backgroundImage: `url(${url})` }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="flex justify-between items-center p-4">
            <FaShare
              className="cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            />
            <button
              onClick={handleWishList}
              className={`p-2 rounded-full transition ${isSetWishList ? 'bg-red-500' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              <FaHeart className={`text-xl ${isSetWishList ? 'text-white' : 'text-gray-600'}`} />
            </button>
          </div>

          {copied && (
            <p className="text-green-500 text-sm text-center">Link copied!</p>
          )}

          {/* Book Appointment */}
          <div className="text-center mt-4">
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-md shadow-md transition"
              onClick={() => alert("Appointment booked! (You can customize this)")}
            >
              Book Appointment
            </button>
          </div>

          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800">{listing.name}</h2>
            <p className="text-xl text-blue-600 mt-2 font-semibold">
              ₹{listing.regularPrice.toLocaleString("en-IN")}
              {listing.type === "rent" && " / month"}
            </p>
            <p className="flex items-center text-gray-600 mt-2">
              <FaMapMarkerAlt className="mr-2 text-red-500" /> {listing.address}
            </p>

            {listing.locationLink && (
              <div className="mt-3">
                <a
                  href={listing.locationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow transition"
                >
                  Locate
                </a>
              </div>
            )}

            <div className="flex space-x-4 mt-4">
              <span className={`px-4 py-1 text-white text-sm font-medium rounded ${listing.type === "rent" ? "bg-blue-500" : "bg-green-600"}`}>
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </span>
              {listing.offer && (
                <span className="px-4 py-1 bg-yellow-400 text-white text-sm font-medium rounded">
                  ₹{+listing.regularPrice - +listing.discountPrice} OFF
                </span>
              )}
            </div>

            <p className="mt-4 text-gray-700 leading-relaxed">
              <span className="font-semibold">Description:</span> {listing.description}
            </p>

            <ul className="mt-6 space-y-2 text-gray-700">
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
        </div>
      )}
    </div>
  );
}
