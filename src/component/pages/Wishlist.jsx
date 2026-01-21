// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { useCart } from "../context/CartContext";
// import ApiService from "../../service/ApiService";
// import "../../style/productList.css";
// import "../../style/wishlist.css";
// import { FaHeart } from "react-icons/fa";

// const Wishlist = () => {
//   const [wishlist, setWishlist] = useState([]);
//   const { dispatch } = useCart();

//   useEffect(() => {
//     loadWishlist();
//   }, []);

//   const loadWishlist = async () => {
//     try {
//       const res = await ApiService.getWishlist();
//       setWishlist(res.data || []);
//     } catch (err) {
//       console.error("Failed to load wishlist");
//     }
//   };

//   const removeFromWishlist = async (productId) => {
//     try {
//       await ApiService.removeFromWishlist(productId);
//       loadWishlist();
//     } catch (err) {
//       console.error("Failed to remove from wishlist");
//     }
//   };

//   const addToCart = (product) => {
//     dispatch({ type: "ADD_ITEM", payload: product });
//   };

//   return (
//     <div className="product-list">
//       {wishlist.length === 0 ? (
//         <h2>Your wishlist is empty ❤️</h2>
//       ) : (
//         wishlist.map((product) => (
//           <div className="product-item" key={product.id}>
//             <div className="image-container">
//               <span
//                 className="wishlist-heart active"
//                 onClick={() => removeFromWishlist(product.id)}
//                 title="Remove from wishlist"
//               >
//                 <FaHeart />
//               </span>

//               {/* NAVIGATE TO PRODUCT */}
//               <Link to={`/product/${product.id}`}>
//                 <img
//                   src={product.imageUrl}
//                   alt={product.name}
//                   className="product-image"
//                 />
//               </Link>
//             </div>

//             <Link to={`/product/${product.id}`}>
//               <h3>{product.name}</h3>
//               <p>{product.description}</p>
//               <span>${product.price.toFixed(2)}</span>
//             </Link>

//             {/* ADD TO CART FROM WISHLIST */}
//             <button onClick={() => addToCart(product)}>Add To Cart</button>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default Wishlist;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ApiService from "../../service/ApiService";
import "../../style/productList.css";
import "../../style/wishlist.css";
import { FaHeart } from "react-icons/fa";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const { cart, dispatch } = useCart();

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const res = await ApiService.getWishlist();
      setWishlist(res.data || []);
    } catch (err) {
      console.error("Failed to load wishlist");
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await ApiService.removeFromWishlist(productId);
      loadWishlist();
    } catch (err) {
      console.error("Failed to remove from wishlist");
    }
  };

  const addToCart = (product) => {
    dispatch({ type: "ADD_ITEM", payload: product });
  };

  const incrementItem = (product) => {
    dispatch({ type: "INCREMENT_ITEM", payload: product });
  };

  const decrementItem = (product) => {
    const cartItem = cart.find((item) => item.id === product.id);
    if (cartItem && cartItem.quantity > 1) {
      dispatch({ type: "DECREMENT_ITEM", payload: product });
    } else {
      dispatch({ type: "REMOVE_ITEM", payload: product });
    }
  };

  return (
    <div className="product-list">
      {wishlist.length === 0 ? (
        <h2>Your wishlist is empty ❤️</h2>
      ) : (
        wishlist.map((product) => {
          const cartItem = cart.find((item) => item.id === product.id);

          return (
            <div className="product-item" key={product.id}>
              <div className="image-container">
                <span
                  className="wishlist-heart active"
                  onClick={() => removeFromWishlist(product.id)}
                  title="Remove from wishlist"
                >
                  <FaHeart />
                </span>

                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="product-image"
                  />
                </Link>
              </div>

              <Link to={`/product/${product.id}`}>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <span>${product.price.toFixed(2)}</span>
              </Link>

              {/* CART CONTROLS */}
              {cartItem ? (
                <div className="quantity-controls">
                  <button onClick={() => decrementItem(product)}> - </button>
                  <span>{cartItem.quantity}</span>
                  <button onClick={() => incrementItem(product)}> + </button>
                </div>
              ) : (
                <button onClick={() => addToCart(product)}>Add To Cart</button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default Wishlist;
