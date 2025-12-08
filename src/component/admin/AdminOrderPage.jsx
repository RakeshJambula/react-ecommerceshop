import React, { useState, useEffect } from "react";
import ApiService from "../../service/ApiService";
import Pagination from "../common/Pagination";
import { useNavigate } from "react-router-dom";
import "../../style/adminOrderPage.css"; // 👈 IMPORTANT

const AdminOrdersPage = () => {
  const [orderItems, setOrderItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, [page]);

  const loadOrders = async () => {
    try {
      const response = await ApiService.getAllOrders();
      const list = response.data || [];
      setOrderItems(list);
      setFiltered(list.slice((page - 1) * itemsPerPage, page * itemsPerPage));
      setTotalPages(Math.ceil(list.length / itemsPerPage));
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusFilter = (e) => {
    const filter = e.target.value;
    setStatus(filter);
    setPage(1);

    const list = filter
      ? orderItems.filter((item) => item.status === filter)
      : orderItems;

    setFiltered(list.slice(0, itemsPerPage));
    setTotalPages(Math.ceil(list.length / itemsPerPage));
  };

  return (
    <div className="admin-orders-page">
      <h2>Manage Orders</h2>

      <div className="filter-bar">
        <select value={status} onChange={handleStatusFilter}>
          <option value="">All Status</option>
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

      <table className="orders-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Status</th>
            <th>Price</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.user?.name}</td>
              <td>{o.status}</td>
              <td>₹{o.price}</td>
              <td>{new Date(o.createdAt).toLocaleDateString()}</td>
              <td>
                <button
                  onClick={() => navigate(`/admin/order-details/${o.id}`)}
                >
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};

export default AdminOrdersPage;
