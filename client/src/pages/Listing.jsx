import React, { useEffect, useState, Fragment } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { useWishlist } from '../WishlistContext';
import { FaHeart, FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaShare } from "react-icons/fa";
import { Dialog } from '@headlessui/react';

export default function Listing() {
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isSetWishList, setWishList] = useState(false);
  const { addToWishlist } = useWishlist();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", date: "" });

  const handleWishList = () => {
    addToWishlist(listing);
    setWishList(!isSetWishList);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Appointment Data:", formData);
    alert("Appointment booked!");
    setIsModalOpen(false);
    setFormData({ name: "", email: "", date: "" });
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
        <div>
          <Swiper navigation modules={[Navigation]} className="rounded-lg overflow-hidden">
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-64 md:h-96 bg-cover bg-center"
                  style={{ backgroundImage: `url(${url})` }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="flex justify-end items-center space-x-4 mt-2 pr-2">
            <button
              onClick={handleWishList}
              className={`p-2 rounded-full transition ${isSetWishList ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              <FaHeart className="text-xl" />
            </button>
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

          <div className="p-4 bg-white shadow-md rounded-lg mt-4">
            <h2 className="text-2xl font-bold">{listing.name}</h2>
            <p className="text-lg text-gray-700">
              ₹{listing.regularPrice.toLocaleString("en-US")}
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
                  ₹{+listing.regularPrice - +listing.discountPrice} OFF
                </span>
              )}
            </div>

            <p className="mt-4 text-gray-700">
              <span className="font-semibold">Description:</span> {listing.description}
            </p>

            <ul className="mt-4 space-y-2">
              <li className="flex items-center"><FaBed className="mr-2 text-blue-500" /> {listing.bedrooms} {listing.bedrooms > 1 ? "beds" : "bed"}</li>
              <li className="flex items-center"><FaBath className="mr-2 text-blue-500" /> {listing.bathrooms} {listing.bathrooms > 1 ? "baths" : "bath"}</li>
              <li className="flex items-center"><FaParking className="mr-2 text-blue-500" /> {listing.parking ? "Parking spot" : "No Parking"}</li>
              <li className="flex items-center"><FaChair className="mr-2 text-blue-500" /> {listing.furnished ? "Furnished" : "Unfurnished"}</li>
            </ul>

            <div className="text-center mt-8">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-md shadow-md transition"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      <Dialog as={Fragment} open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
          <Dialog.Panel className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
            <Dialog.Title className="text-lg font-semibold mb-4">Book an Appointment</Dialog.Title>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your Name"
                required
                className="w-full border border-gray-300 px-4 py-2 rounded"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Your Email"
                required
                className="w-full border border-gray-300 px-4 py-2 rounded"
              />
              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 px-4 py-2 rounded"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                >
                  Confirm
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
