import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const [formData, setFormData] = useState({
    imageUrls: [
      "https://m.economictimes.com/thumb/height-450,width-600,imgsize-22382,msid-111780228/which-mansion-tops-the-list-of-the-worlds-most-expensive-houses.jpg",
      "https://www.bhg.com/thmb/H9VV9JNnKl-H1faFXnPlQfNprYw=/1799x0/filters:no_upscale():strip_icc()/white-modern-house-curved-patio-archway-c0a4a3b3-aa51b24d14d0464ea15d36e05aa85ac9.jpg",
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
    ],
    name: '',
    description: '',
    address: '',
    type: '',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector(state => state.user);
  const navigate = useNavigate();

  const onHandleRemoveImage = (index) => {
    setFormData({
      ...formData, imageUrls: formData.imageUrls.filter((_, i) => i !== index)
    });
  };

  const onHandleChanges = (e) => {
    const { id, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [id]: type === 'checkbox' ? checked : value
    });
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    if (formData.imageUrls.length < 1) return setError("At least one image must be there");
    if (formData.regularPrice < formData.discountPrice) return setError("Discount price should be lesser than regular price");
    setLoading(true);
    setError('');
    try {
      const res = await fetch("/api/listing/create", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userRef: currentUser._id })
      });
      const data = await res.json();
      if (!data.success) {
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
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create a Listing</h1>
      <form onSubmit={onSubmitForm} className="space-y-4">
        <input type="text" id="name" placeholder="Name" required onChange={onHandleChanges} value={formData.name} className="w-full p-2 border rounded" />
        <input type="text" id="description" placeholder="Description" required onChange={onHandleChanges} value={formData.description} className="w-full p-2 border rounded" />
        <input type="text" id="address" placeholder="Address" required onChange={onHandleChanges} value={formData.address} className="w-full p-2 border rounded" />
        
        <div className="flex flex-wrap gap-4">
          {['sale', 'rent', 'parking', 'furnished', 'offer'].map((item) => (
            <label key={item} className="flex items-center gap-2">
              <input type="checkbox" id={item} onChange={onHandleChanges} checked={formData[item]} />
              <span className="capitalize">{item}</span>
            </label>
          ))}
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
        
        <div>
          <p>Images:</p>
          <span className="text-sm text-gray-600">The first image will be the cover (max 6)</span>
        </div>
        
        <div className="flex items-center gap-4">
          <input type="file" id="images" accept='image/*' multiple className="p-2 border rounded" />
          <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded">Upload</button>
        </div>
        
        <div className="flex flex-wrap gap-4">
          {formData.imageUrls.map((url, index) => (
            <div key={url} className="relative w-20 h-20">
              <img src={url} alt="listing" className="w-full h-full object-cover rounded" />
              <button onClick={() => onHandleRemoveImage(index)} type="button" className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded">X</button>
            </div>
          ))}
        </div>
        
        <button className="w-full bg-green-500 text-white p-2 rounded">{loading ? 'Creating...' : 'Create Listing'}</button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
