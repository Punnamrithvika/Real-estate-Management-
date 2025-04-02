import React from "react";
import { useWishlist } from "../WishlistContext";
import WishListItem from "../components/WishListItems";

const WishList = () => {
  const { wishlist } = useWishlist();

  return (
    <div>
      {wishlist.length > 0 ? (
        <div className="mb-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {wishlist.map((listing) => (
              <WishListItem key={listing._id} listing={listing} />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Your wishlist is empty.</p>
      )}
    </div>
  );
};

export default WishList;
