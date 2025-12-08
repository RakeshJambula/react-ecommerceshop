import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import "../../style/adminOrderDetails.css";

const AdminOrderDetailsPage = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const [orderItem, setOrderItem] = useState(null);
  const [status, setStatus] = useState("");
  const [msg, setMsg] = useState("");

  const loadOrder = async () => {
    try {
      const response = await ApiService.getOrderById(itemId);
      setOrderItem(response.data);
      setStatus(response.data.status);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (itemId) loadOrder();
  }, [itemId]);

  const updateOrderStatus = async () => {
    if (!status) return setMsg("Please select a status ❌");

    try {
      await ApiService.updateOrderStatus(itemId, status);
      setMsg("✔ Status Updated Successfully!");
      setTimeout(() => navigate("/admin/orders"), 1200);
    } catch {
      setMsg("❌ Failed to update status");
    }
  };

  return (
    <div className="order-details-page">
      <div className="order-card">
        <h2>Order Status Update</h2>

        <p>
          <strong>Order ID:</strong> {itemId}
        </p>
        <p>
          <strong>User:</strong> {orderItem?.user?.name}
        </p>
        <p>
          <strong>Current Status:</strong> {orderItem?.status}
        </p>

        <div className="select-box">
          <label>
            <strong>Update To:</strong>
          </label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {[
              "PENDING",
              "CONFIRMED",
              "SHIPPED",
              "DELIVERED",
              "CANCELLED",
              "RETURNED",
            ].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="button-group">
          <button className="update-btn" onClick={updateOrderStatus}>
            Update Status
          </button>

          <button
            className="back-btn"
            onClick={() => navigate("/admin/orders")}
          >
            Back
          </button>
        </div>

        {msg && (
          <p className={`message ${msg.includes("✔") ? "success" : "error"}`}>
            {msg}
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminOrderDetailsPage;
