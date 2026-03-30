import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import { useCart } from "../context/CartContext";
import "../../style/cart.css";

const CartPage = () => {
  const { cart, dispatch } = useCart();

  const [message, setMessage] = useState(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  // Coupon
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);

  const navigate = useNavigate();

  // ----------------- CART ACTIONS -----------------

  const resetCoupon = () => {
    setDiscount(0);
    setFinalAmount(0);
    setCouponCode("");
  };

  const incrementItem = (product) => {
    const cartItem = cart.find((item) => item.id === product.id);

    if (cartItem.quantity >= Number(product.stock)) {
      setMessage("Maximum stock reached");
      return;
    }

    dispatch({ type: "INCREMENT_ITEM", payload: product });
    resetCoupon();
  };

  const decrementItem = (product) => {
    const cartItem = cart.find((item) => item.id === product.id);

    if (cartItem && cartItem.quantity > 1) {
      dispatch({ type: "DECREMENT_ITEM", payload: product });
    } else {
      dispatch({ type: "REMOVE_ITEM", payload: product });
    }

    resetCoupon();
  };

  // ----------------- CALCULATIONS -----------------

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const hasOutOfStock = cart.some((item) => Number(item.stock ?? 0) === 0);

  // ----------------- COUPON -----------------

  const applyCoupon = async () => {
    if (!couponCode) {
      setMessage("Please enter coupon code");
      return;
    }

    try {
      const response = await ApiService.validateCoupon({
        couponCode,
        amount: totalPrice,
      });

      setDiscount(response.discount);
      setFinalAmount(response.finalAmount);

      setMessage("Coupon applied successfully");
    } catch (err) {
      setDiscount(0);
      setFinalAmount(0);
      setMessage(err.response?.data?.message || "Invalid coupon");
    }

    setTimeout(() => setMessage(""), 3000);
  };

  // ----------------- ORDER -----------------

  const buildOrderItems = () =>
    cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));

  const placeCodOrder = async () => {
    const orderRequest = {
      paymentMethod: "COD",
      items: buildOrderItems(),
      couponCode: couponCode || null,
    };

    try {
      const response = await ApiService.createOrder(orderRequest);

      setMessage(`Order placed! Final Amount: ₹${response.data.totalPrice}`);

      dispatch({ type: "CLEAR_CART" });
      resetCoupon();
    } catch (err) {
      setMessage(err.response?.data?.message || "COD Order failed");
    }

    setTimeout(() => setMessage(""), 3000);
  };

  const handleOnlinePayment = async () => {
    const orderRequest = {
      paymentMethod: "ONLINE",
      items: buildOrderItems(),
      couponCode: couponCode || null,
    };

    try {
      const orderResponse = await ApiService.createOrder(orderRequest);
      const orderId = orderResponse.data.id;

      const paymentResponse = await ApiService.createPaymentOrder(orderId);

      const options = {
        key: paymentResponse.data.key,
        amount: paymentResponse.data.amount * 100,
        currency: paymentResponse.data.currency,
        name: "Ecommerce",
        order_id: paymentResponse.data.razorpayOrderId,
        handler: async function (response) {
          try {
            await ApiService.verifyPayment(response);
            setMessage("Payment Successful! Order Confirmed.");

            dispatch({ type: "CLEAR_CART" });
            resetCoupon();
          } catch (err) {
            setMessage("Payment Verification Failed");
          }
        },
        theme: { color: "#3399cc" },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      setMessage("Online Payment failed");
    }

    setTimeout(() => setMessage(""), 3000);
  };

  const handleCheckoutClick = () => {
    if (hasOutOfStock) {
      setMessage("Some items are out of stock. Please remove them.");
      return;
    }

    if (!ApiService.isAuthenticated()) {
      setMessage("Login required");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    setShowPaymentOptions(true);
  };

  // ----------------- UI -----------------

  return (
    <div className="cart-page">
      <h1>Cart</h1>

      {message && <p className="response-message">{message}</p>}

      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {showPaymentOptions ? (
            <div className="payment-options">
              <h3>Select Payment Method</h3>

              <div className="payment-buttons">
                <button className="payment-btn cod" onClick={placeCodOrder}>
                  Cash On Delivery
                </button>

                <button
                  className="payment-btn online"
                  onClick={handleOnlinePayment}
                >
                  Online Payment
                </button>
              </div>
            </div>
          ) : (
            <>
              <ul>
                {cart.map((item) => {
                  const stock = Number(item.stock ?? 0);

                  return (
                    <li key={item.id}>
                      <img src={item.imageUrl} alt={item.name} />

                      <div>
                        <h2>{item.name}</h2>
                        <p>{item.description}</p>

                        {/* STOCK HANDLING */}
                        {stock === 0 ? (
                          <div style={{ display: "flex", gap: "10px" }}>
                            <button disabled className="out-of-stock">
                              Out Of Stock
                            </button>

                            <button
                              className="remove-btn"
                              onClick={() =>
                                dispatch({
                                  type: "REMOVE_ITEM",
                                  payload: item,
                                })
                              }
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <div className="quantity-controls">
                            <button onClick={() => decrementItem(item)}>
                              -
                            </button>

                            <span>{item.quantity}</span>

                            <button
                              onClick={() => incrementItem(item)}
                              disabled={item.quantity >= stock}
                            >
                              +
                            </button>
                          </div>
                        )}

                        <span>₹{item.price.toFixed(2)}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* OUT OF STOCK WARNING */}
              {hasOutOfStock && (
                <p style={{ color: "red", fontWeight: "bold" }}>
                  Some items are out of stock. Remove them before checkout.
                </p>
              )}

              {/* COUPON */}
              <div className="coupon-section">
                <input
                  type="text"
                  placeholder="Enter coupon.."
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />

                <button className="apply-btn" onClick={applyCoupon}>
                  Apply
                </button>
              </div>

              {/* PRICE DETAILS */}
              <div style={{ marginTop: "20px" }}>
                <h3>Subtotal: ₹{totalPrice.toFixed(2)}</h3>

                {discount > 0 && (
                  <h3 style={{ color: "green" }}>Discount: -₹{discount}</h3>
                )}

                <h2>Final: ₹{(finalAmount || totalPrice).toFixed(2)}</h2>
              </div>

              <button
                className="checkout-button"
                onClick={handleCheckoutClick}
                disabled={hasOutOfStock}
              >
                Checkout
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CartPage;
