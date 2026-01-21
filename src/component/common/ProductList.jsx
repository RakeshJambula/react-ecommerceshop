// import React from "react";
// import { Link } from "react-router-dom";
// import { useCart } from "../context/CartContext";
// import "../../style/productList.css";

// const ProductList = ({ products }) => {
//   const { cart, dispatch } = useCart();

//   const addToCart = (product) => {
//     dispatch({ type: "ADD_ITEM", payload: product });
//   };

//   const incrementItem = (product) => {
//     dispatch({ type: "INCREMENT_ITEM", payload: product });
//   };

//   const decrementItem = (product) => {
//     const cartItem = cart.find((item) => item.id === product.id);
//     if (cartItem && cartItem.quantity > 1) {
//       dispatch({ type: "DECREMENT_ITEM", payload: product });
//     } else {
//       dispatch({ type: "REMOVE_ITEM", payload: product });
//     }
//   };

//   return (
//     <div className="product-list">
//       {products.map((product, index) => {
//         const cartItem = cart.find((item) => item.id === product.id);
//         return (
//           <div className="product-item" key={index}>
//             <Link to={`/product/${product.id}`}>
//               <img
//                 src={product.imageUrl}
//                 alt={product.name}
//                 className="product-image"
//               />
//               <h3>{product.name}</h3>
//               <p>{product.description}</p>
//               <span>${product.price.toFixed(2)}</span>
//             </Link>
//             {cartItem ? (
//               <div className="quantity-controls">
//                 <button onClick={() => decrementItem(product)}> - </button>
//                 <span>{cartItem.quantity}</span>
//                 <button onClick={() => incrementItem(product)}> + </button>
//               </div>
//             ) : (
//               <button onClick={() => addToCart(product)}>Add To Cart</button>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default ProductList;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ApiService from "../../service/ApiService";
import "../../style/productList.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const ProductList = ({ products }) => {
  const { cart, dispatch } = useCart();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const res = await ApiService.getWishlist();
      setWishlist(res.data || []);
    } catch (err) {
      console.error("Wishlist load failed");
    }
  };

  const isWishlisted = (id) => {
    return wishlist.some((p) => p.id === id);
  };

  const toggleWishlist = async (productId) => {
    if (isWishlisted(productId)) {
      await ApiService.removeFromWishlist(productId);
    } else {
      await ApiService.addToWishlist(productId);
    }
    loadWishlist();
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
      {products.map((product, index) => {
        const cartItem = cart.find((item) => item.id === product.id);

        return (
          <div className="product-item" key={index}>
            <div className="image-container">
              {/* <span
                className={
                  isWishlisted(product.id)
                    ? "wishlist-heart active"
                    : "wishlist-heart"
                }
                onClick={() => toggleWishlist(product.id)}
              >
                ♥
              </span> */}
              <span
                className={
                  isWishlisted(product.id)
                    ? "wishlist-heart active"
                    : "wishlist-heart"
                }
                onClick={() => toggleWishlist(product.id)}
              >
                {isWishlisted(product.id) ? <FaHeart /> : <FaRegHeart />}
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
      })}
    </div>
  );
};

export default ProductList;
