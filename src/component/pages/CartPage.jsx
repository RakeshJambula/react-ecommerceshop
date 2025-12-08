import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import { useCart } from "../context/CartContext";
import "../../style/cart.css";

const CartPage = () => {
  const { cart, dispatch } = useCart();
  const [message, setMessage] = useState(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  const navigate = useNavigate();

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

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const placeCodOrder = async () => {
    const orderItems = cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));

    const orderRequest = {
      totalPrice,
      paymentType: "COD",
      items: orderItems,
    };

    try {
      const response = await ApiService.createOrder(orderRequest);
      setMessage(response.message);
      dispatch({ type: "CLEAR_CART" });
    } catch (err) {
      setMessage("COD Order failed");
    }

    setTimeout(() => setMessage(""), 3000);
  };

  const handleOnlinePayment = async () => {
    const orderItems = cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));

    const orderRequest = {
      totalPrice,
      paymentType: "ONLINE",
      items: orderItems,
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
    if (!ApiService.isAuthenticated()) {
      setMessage("You need to login first");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }
    setShowPaymentOptions(true);
  };

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
                {cart.map((item) => (
                  <li key={item.id}>
                    <img src={item.imageUrl} alt={item.name} />
                    <div>
                      <h2>{item.name}</h2>
                      <p>{item.description}</p>

                      <div className="quantity-controls">
                        <button onClick={() => decrementItem(item)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => incrementItem(item)}>+</button>
                      </div>

                      <span>₹{item.price.toFixed()}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <h2>Total: ₹{totalPrice.toFixed(2)}</h2>

              <button className="checkout-button" onClick={handleCheckoutClick}>
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
