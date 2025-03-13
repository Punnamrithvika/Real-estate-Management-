import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data);
      } catch (error) {
        console.error("Error fetching offer listings", error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=4");
        const data = await res.json();
        setRentListings(data);
      } catch (error) {
        console.error("Error fetching rent listings", error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=4");
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.error("Error fetching sale listings", error);
      }
    };

    fetchOfferListings();
    fetchRentListings();
    fetchSaleListings();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <div className="text-center py-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <h1 className="text-4xl font-extrabold">Find Your Dream Home</h1>
        <p className="mt-2 text-lg">Discover the best homes at unbeatable prices</p>
        <Link to="/search" className="mt-4 inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-200 transition">
          Start Exploring
        </Link>
      </div>

      {/* Swiper Slider for Featured Listings */}
      {offerListings.length > 0 && (
        <div className="my-8 mx-auto max-w-4xl">
          <Swiper modules={[Navigation]} navigation className="rounded-lg shadow-lg">
            {offerListings.map((listing) => (
              <SwiperSlide key={listing._id} className="flex justify-center">
                <img src={listing.imageUrls[0]} className="h-56 w-full object-cover rounded-lg" alt="Listing" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Listings Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Offer Listings */}
        {offerListings.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">🔥 Exclusive Offers</h2>
              <Link to="/search?offer=true" className="text-blue-600 hover:underline">View All Offers</Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {offerListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}

        {/* Rent Listings */}
        {rentListings.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">🏡 Homes for Rent</h2>
              <Link to="/search?type=rent" className="text-blue-600 hover:underline">View All Rentals</Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {rentListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}

        {/* Sale Listings */}
        {saleListings.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">🏠 Homes for Sale</h2>
              <Link to="/search?type=sale" className="text-blue-600 hover:underline">View All Sales</Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {saleListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
