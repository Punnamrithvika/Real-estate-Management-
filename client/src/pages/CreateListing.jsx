import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "sale", // Default selection
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

  const onHandleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const onHandleChanges = (e) => {
    const { id, value, checked, type, name } = e.target;
    setFormData({
      ...formData,
      [name || id]: type === "checkbox" ? checked : value,
    });
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();

    if (!formData.type) return setError("Please select a listing type (Sale or Rent)");
    if (formData.imageUrls.length < 1) return setError("At least one image must be uploaded");
    if (formData.regularPrice < formData.discountPrice)
      return setError("Discount price should be less than regular price");

    setLoading(true);
    setError("");

    try {
      console.log("Sending form data:", formData); // Debugging: Check if type exists

      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });

      const data = await res.json();
      setLoading(false);
      if (data.success===false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false)
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create a Listing</h1>

      <form onSubmit={onSubmitForm} className="space-y-4">
        <input type="text" id="name" placeholder="Name" required onChange={onHandleChanges} value={formData.name} className="w-full p-2 border rounded" />
        <input type="text" id="description" placeholder="Description" required onChange={onHandleChanges} value={formData.description} className="w-full p-2 border rounded" />
        <input type="text" id="address" placeholder="Address" required onChange={onHandleChanges} value={formData.address} className="w-full p-2 border rounded" />

        
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input type="radio" name="type" value="sale" onChange={onHandleChanges} checked={formData.type === "sale"} />
            <span>Sale</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="type" value="rent" onChange={onHandleChanges} checked={formData.type === "rent"} />
            <span>Rent</span>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <input type="number" id="bedrooms" onChange={onHandleChanges} value={formData.bedrooms} className="w-full p-2 border rounded" />
            <span>Beds</span>
          </div>
          <div>
            <input type="number" id="bathrooms" onChange={onHandleChanges} value={formData.bathrooms} className="w-full p-2 border rounded" />
            <span>Baths</span>
          </div>
          <div>
            <input type="number" id="regularPrice" onChange={onHandleChanges} value={formData.regularPrice} className="w-full p-2 border rounded" />
            <span>Regular price</span>
          </div>
          <div>
            <input type="number" id="discountPrice" onChange={onHandleChanges} value={formData.discountPrice} className="w-full p-2 border rounded" />
            <span>Discount price</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {["parking", "furnished", "offer"].map((item) => (
            <label key={item} className="flex items-center gap-2">
              <input type="checkbox" id={item} onChange={onHandleChanges} checked={formData[item]} />
              <span className="capitalize">{item}</span>
            </label>
          ))}
        </div>

        <div>
  <p>Enter Image URLs (Max 3):</p>
  {[0, 1, 2].map((index) => (
    <input
      key={index}
      type="text"
      placeholder={`Image URL ${index + 1}`}
      value={formData.imageUrls[index] || ""}
      onChange={(e) => {
        const newImageUrls = [...formData.imageUrls];
        newImageUrls[index] = e.target.value;
        setFormData({ ...formData, imageUrls: newImageUrls });
      }}
      className="w-full p-2 border rounded my-2"
    />
  ))}
</div>


        <div className="flex flex-wrap gap-4">
          {formData.imageUrls.map((url, index) => (
            <div key={url} className="relative w-20 h-20">
              <img src={url} alt="listing" className="w-full h-full object-cover rounded" />
              <button onClick={() => onHandleRemoveImage(index)} type="button" className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded">
                X
              </button>
            </div>
          ))}
        </div>

        <button className="w-full bg-green-500 text-white p-2 rounded">{loading ? "Creating..." : "Create Listing"}</button>
      </form>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
