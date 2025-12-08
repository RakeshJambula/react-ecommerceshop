import React, { useEffect } from "react";
import ApiService from "../../service/ApiService";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const { cart, dispatch } = useCart();
  const navigate = useNavigate();

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const items = cart.map((item) => ({
    productId: item.id,
    quantity: item.quantity,
  }));

  // ------- COD PAYMENT -------
  const handleCODPayment = async () => {
    try {
      const orderRequest = {
        totalPrice,
        paymentType: "COD",
        items,
      };

      await ApiService.createOrder(orderRequest);

      alert("Order placed successfully with Cash on Delivery!");
      dispatch({ type: "CLEAR_CART" });

      navigate("/profile");
    } catch (err) {
      alert("COD Order Failed");
    }
  };

  // ------- ONLINE PAYMENT -------
  const handleOnlinePayment = async () => {
    try {
      const orderReq = {
        totalPrice,
        paymentType: "ONLINE",
        items,
      };

      const orderResponse = await ApiService.createOrder(orderReq);
      const orderId = orderResponse.data.id;

      const paymentResponse = await ApiService.createPaymentOrder(orderId);

      const options = {
        key: paymentResponse.data.key,
        amount: paymentResponse.data.amount * 100,
        currency: paymentResponse.data.currency,
        name: "Ecommerce Shop",
        order_id: paymentResponse.data.razorpayOrderId,

        handler: async function (response) {
          const verifyBody = {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          };

          await ApiService.verifyPayment(verifyBody);

          alert("Payment Successful! Order confirmed.");
          dispatch({ type: "CLEAR_CART" });

          navigate("/profile");
        },

        theme: { color: "#3399cc" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      alert("Online Payment Failed");
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>Checkout Payment</h2>
      <h3>Total: ₹{totalPrice.toFixed(2)}</h3>

      <button onClick={handleCODPayment}>Cash On Delivery</button>
      <br />
      <br />
      <button onClick={handleOnlinePayment}>Pay Online (Razorpay)</button>
    </div>
  );
};

export default PaymentPage;
