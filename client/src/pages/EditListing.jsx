import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function EditListing() {
  const [formData, setFormData] = useState({
    imageUrls: [
      "https://m.economictimes.com/thumb/height-450,width-600,imgsize-22382,msid-111780228/which-mansion-tops-the-list-of-the-worlds-most-expensive-houses.jpg",
      "https://www.bhg.com/thmb/H9VV9JNnKl-H1faFXnPlQfNprYw=/1799x0/filters:no_upscale():strip_icc()/white-modern-house-curved-patio-archway-c0a4a3b3-aa51b24d14d0464ea15d36e05aa85ac9.jpg",
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    ],
    name: "",
    description: "",
    address: "",
    type: "",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const apiUrl = `/api/listing/get/${listingId}`;
      const res = await fetch(apiUrl);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };
    fetchListing();
  }, []);

  const onHandleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const onHandleChanges = (e) => {
    const { id, value, checked } = e.target;
    if (id === "sale" || id === "rent") {
      setFormData({ ...formData, type: id });
    } else if (id === "parking" || id === "furnished" || id === "offer") {
      setFormData({ ...formData, [id]: checked });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1) return setError("At least one image must be there");
      if (formData.regularPrice < formData.discountPrice)
        return setError("Discount price should be lesser than regular price");
      setLoading(true);
      setError(false);
      const apiUrl = `/api/listing/update/${params.listingId}`;
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      };
      const res = await fetch(apiUrl, options);
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Edit Listing</h1>
      <form onSubmit={onSubmitForm} className="space-y-4">
        {/* Name, Description, Address */}
        <input
          type="text"
          placeholder="Name"
          id="name"
          required
          onChange={onHandleChanges}
          value={formData.name}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Description"
          id="description"
          required
          onChange={onHandleChanges}
          value={formData.description}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Address"
          id="address"
          required
          onChange={onHandleChanges}
          value={formData.address}
          className="w-full border p-2 rounded"
        />

        {/* Checkboxes */}
        <div className="grid grid-cols-3 gap-4">
          {["sale", "rent", "parking", "furnished", "offer"].map((id) => (
            <label key={id} className="flex items-center space-x-2">
              <input type="checkbox" id={id} onChange={onHandleChanges} checked={formData[id]} />
              <span className="text-gray-600 font-semibold capitalize">{id}</span>
            </label>
          ))}
        </div>

        {/* Bedrooms, Bathrooms, Prices */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: "bedrooms", label: "Beds" },
            { id: "bathrooms", label: "Baths" },
            { id: "regularPrice", label: "Regular Price" },
            { id: "discountPrice", label: "Discount Price" },
          ].map(({ id, label }) => (
            <label key={id} className="flex flex-col">
              <span className="text-gray-600 font-semibold">{label}</span>
              <input
                type="number"
                id={id}
                onChange={onHandleChanges}
                value={formData[id]}
                className="border p-2 rounded"
              />
            </label>
          ))}
        </div>

        {/* Images */}
        <div className="mt-4">
          <p className="font-semibold">Images:</p>
          <p className="text-gray-500 text-sm">The first image will be the cover (max 6)</p>
        </div>
        <div className="flex items-center space-x-4">
          <input type="file" id="images" accept="image/*" multiple className="border p-2 rounded" />
          <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded">Upload</button>
        </div>

        {/* Display Images */}
        <div className="flex space-x-4">
          {formData.imageUrls.map((url, index) => (
            <div key={url} className="relative">
              <img src={url} alt="listing" className="w-20 h-20 object-cover rounded" />
              <button
                onClick={() => onHandleRemoveImage(index)}
                type="button"
                className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded"
              >
                X
              </button>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button className="w-full bg-blue-500 text-white py-2 rounded">
          {loading ? "Updating..." : "Update Listing"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
