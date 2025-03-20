import React, { createContext, useState, useContext,useEffect} from 'react';

const WishlistContext = createContext();

const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(()=>{
     return JSON.parse(localStorage.getItem('wishlist'))||[];
  });

  const addToWishlist = (product) => {
    setWishlist((prev) => {
      if (prev.find((item) => product._id === item._id)) {
        return prev; // Avoid duplicates
      }
      const updatedWishList=[...prev,product]
      localStorage.setItem('wishlist',JSON.stringify(updatedWishList))
      return updatedWishList
    });
  };

  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((item) => item._id !== id));
  };

  useEffect(()=>{
    localStorage.setItem('wishlist',JSON.stringify(wishlist))
  },[wishlist])
  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistProvider;

export const useWishlist = () => useContext(WishlistContext);
