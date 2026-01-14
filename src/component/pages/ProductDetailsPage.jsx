import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ApiService from "../../service/ApiService";
import "../../style/productDetailsPage.css";

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const { cart, refreshCart } = useCart();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);

  // Review form state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);

  // ---------------- FETCH DATA ----------------
  useEffect(() => {
    if (productId) {
      fetchProduct();
      fetchReviews();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await ApiService.getProductById(productId);
      setProduct(response.product || response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await ApiService.getReviewsByProduct(productId);
      setReviews(res.data || res);
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- CART ----------------
  const addToCart = async () => {
    await ApiService.addToCart(product.id);
    refreshCart();
  };

  const incrementItem = async () => {
    await ApiService.incrementCartItem(product.id);
    refreshCart();
  };

  const decrementItem = async () => {
    const cartItem = cart.find((item) => item.id === product.id);
    if (cartItem && cartItem.quantity > 1) {
      await ApiService.decrementCartItem(product.id);
    } else {
      await ApiService.removeCartItem(product.id);
    }
    refreshCart();
  };

  // ---------------- REVIEW SUBMIT ----------------
  const submitReview = async () => {
    if (rating === 0 || comment.trim() === "") {
      alert("Please give rating and comment");
      return;
    }

    const reviewData = {
      productId,
      rating,
      content: comment,
    };

    try {
      if (editingReviewId) {
        await ApiService.updateReview(editingReviewId, reviewData);
      } else {
        await ApiService.addReview(reviewData);
      }
      setRating(0);
      setComment("");
      setEditingReviewId(null);
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await ApiService.deleteReview(id);
      if (editingReviewId === id) {
        setEditingReviewId(null);
        setRating(0);
        setComment("");
      }
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- STAR RENDER ----------------
  const renderStars = (value) => {
    const numericValue = Number(value) || 0;
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        style={{
          color: index < numericValue ? "#f68b1e" : "#ccc",
          fontSize: "22px",
        }}
      >
        ★
      </span>
    ));
  };

  if (!product) return <p>Loading product details ...</p>;

  const cartItem = cart.find((item) => item.id === product.id);

  // ---------------- UI ----------------
  return (
    <div className="product-detail">
      {/* PRODUCT INFO */}
      <img src={product.imageUrl} alt={product.name} />
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <span>${product.price.toFixed(2)}</span>

      {/* CART BUTTONS */}
      {cartItem ? (
        <div className="quantity-controls">
          <button onClick={decrementItem}>-</button>
          <span>{cartItem.quantity}</span>
          <button onClick={incrementItem}>+</button>
        </div>
      ) : (
        <button onClick={addToCart}>Add To Cart</button>
      )}

      {/* REVIEW FORM */}
      {ApiService.isAuthenticated() && (
        <div className="review-form">
          <h3>{editingReviewId ? "Edit Your Review" : "Write a Review"}</h3>
          <div className="star-input">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                style={{
                  color: star <= rating ? "#ff9800" : "#ccc",
                  fontSize: "26px",
                  cursor: "pointer",
                }}
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button onClick={submitReview} className="submit-btn">
            {editingReviewId ? "Update Review" : "Submit Review"}
          </button>
        </div>
      )}

      {/* REVIEW LIST */}
      <div className="review-section">
        <h3>Customer Reviews</h3>
        {reviews.length === 0 && <p>No reviews yet.</p>}

        {reviews.map((review) => (
          <div key={review.id} className="review-card">
            {renderStars(review.rating)}
            <p>{review.content}</p>
            <p className="review-time">
              {new Date(review.createdAt).toLocaleString()}
            </p>

            {ApiService.isAuthenticated() && (
              <div className="review-actions">
                <button
                  className="edit-btn"
                  onClick={() => {
                    setEditingReviewId(review.id);
                    setComment(review.content);
                    setRating(Number(review.rating));
                  }}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(review.id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetailsPage;
