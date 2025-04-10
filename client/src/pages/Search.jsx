import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Search() {
    const location = useLocation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        searchTerm: "",
        type: "all",
        parking: false,
        furnished: false,
        offer: false,
        sort: "created_at",
        order: "desc",
    });
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMoreListing, setShowMoreListing] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        setFormData({
            searchTerm: urlParams.get("searchTerm") || "",
            type: urlParams.get("type") || "all",
            parking: urlParams.get("parking") === "true",
            furnished: urlParams.get("furnished") === "true",
            offer: urlParams.get("offer") === "true",
            sort: urlParams.get("sort") || "created_at",
            order: urlParams.get("order") || "desc",
        });

        const fetchListings = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/listing/get?${urlParams.toString()}`);
                const data = await res.json();
                setListings(data);
                setShowMoreListing(data.length > 8);
            } catch (error) {
                console.error("Error fetching listings:", error);
            }
            setLoading(false);
        };
        fetchListings();
    }, [location.search]);

    const handleChanges = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(formData);
        navigate(`?${urlParams.toString()}`);
    };

    const showMoreListingClick = async () => {
        const urlParams = new URLSearchParams(location.search);
        urlParams.set("startIndex", listings.length);
        const res = await fetch(`/api/listing/get?${urlParams.toString()}`);
        const data = await res.json();
        setListings((prev) => [...prev, ...data]);
        setShowMoreListing(data.length >= 8);
    };

    return (
        <div className="container mx-auto p-4">
            <form
                onSubmit={handleSubmit}
                className="grid md:grid-cols-2 gap-4 bg-gray-100 p-4 rounded-lg"
            >
                <input
                    type="text"
                    name="searchTerm"
                    placeholder="Search..."
                    value={formData.searchTerm}
                    onChange={handleChanges}
                    className="p-2 border rounded-md w-full"
                />

                <select
                    name="sort_order"
                    onChange={(e) => {
                        const [sort, order] = e.target.value.split("_");
                        setFormData((prev) => ({
                            ...prev,
                            sort,
                            order,
                        }));
                    }}
                    value={`${formData.sort}_${formData.order}`}
                    className="p-2 border rounded-md w-full"
                >
                    <option value="regularPrice_desc">Price high to low</option>
                    <option value="regularPrice_asc">Price low to high</option>
                    <option value="created_at_desc">Latest</option>
                    <option value="created_at_asc">Oldest</option>
                </select>

                {/* Radio Buttons for Type Selection */}
                <div className="flex gap-4">
                    <label>
                        <input
                            type="radio"
                            name="type"
                            value="all"
                            checked={formData.type === "all"}
                            onChange={handleChanges}
                        />{" "}
                        All
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="type"
                            value="rent"
                            checked={formData.type === "rent"}
                            onChange={handleChanges}
                        />{" "}
                        Rent
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="type"
                            value="sale"
                            checked={formData.type === "sale"}
                            onChange={handleChanges}
                        />{" "}
                        Sale
                    </label>
                </div>

                {/* Checkboxes for Filters */}
                <div className="flex gap-4">
                    <label>
                        <input
                            type="checkbox"
                            name="parking"
                            onChange={handleChanges}
                            checked={formData.parking}
                        />{" "}
                        Parking
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="furnished"
                            onChange={handleChanges}
                            checked={formData.furnished}
                        />{" "}
                        Furnished
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="offer"
                            onChange={handleChanges}
                            checked={formData.offer}
                        />{" "}
                        Offer
                    </label>
                </div>

                <button type="submit" className="bg-blue-600 text-white p-2 rounded-md w-full">
                    Search
                </button>
            </form>

            {/* Listings Display */}
            <div className="mt-4">
                <h1 className="text-xl font-bold">Listings</h1>
                {loading && <p>Loading...</p>}
                {!loading && listings.length === 0 && <p>No Listings found</p>}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {listings.map((listing) => (
                        <ListingItem key={listing._id} listing={listing} />
                    ))}
                </div>
                {showMoreListing && (
                    <div className="flex justify-center mt-4">
                    <button
                        type="button"
                        onClick={showMoreListingClick}
                        className="mt-4 bg-gray-600 text-white p-2 rounded-md w-500"
                    >
                        Show More
                    </button>
                    </div>
                )}
            </div>
        </div>
    );
}
