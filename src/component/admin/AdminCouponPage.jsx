import React, { useEffect, useState } from "react";
import ApiService from "../../service/ApiService";
import "../../style/adminCoupon.css";

const AdminCouponPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    code: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    minOrderAmount: "",
    expiryDate: "",
    usageLimit: "",
  });

  // ================= FETCH =================
  const fetchCoupons = async () => {
    try {
      const res = await ApiService.getAllCoupons();
      setCoupons(res.data || []);
    } catch {
      showToast("Failed to load coupons", "error");
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // ================= TOAST =================
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= CREATE =================
  const handleCreate = async () => {
    if (!form.code || !form.discountValue) {
      showToast("Please fill required fields", "error");
      return;
    }

    const payload = {
      code: form.code,
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      minOrderAmount: Number(form.minOrderAmount),
      expiryDate: form.expiryDate ? form.expiryDate + "T23:59:59" : null,
      usageLimit: Number(form.usageLimit),
    };

    try {
      await ApiService.createCoupon(payload);
      showToast("Coupon created successfully ");

      setForm({
        code: "",
        discountType: "PERCENTAGE",
        discountValue: "",
        minOrderAmount: "",
        expiryDate: "",
        usageLimit: "",
      });

      fetchCoupons();
    } catch (err) {
      showToast(err.response?.data?.message || "Creation failed", "error");
    }
  };

  // ================= TOGGLE =================
  const handleToggle = async (id, currentStatus) => {
    try {
      await ApiService.toggleCoupon(id, !currentStatus);
      showToast("Status updated successfully");
      fetchCoupons();
    } catch {
      showToast("Update failed", "error");
    }
  };

  return (
    <div className="coupon-page">
      <h1>Manage Coupons</h1>

      {/* TOAST */}
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}

      {/* FORM */}
      <div className="coupon-form">
        <input
          name="code"
          placeholder="Coupon Code"
          value={form.code}
          onChange={handleChange}
        />

        <select
          name="discountType"
          value={form.discountType}
          onChange={handleChange}
        >
          <option value="PERCENTAGE">Percentage</option>
          <option value="FIXED">Fixed</option>
        </select>

        <input
          name="discountValue"
          placeholder="Discount Value"
          value={form.discountValue}
          onChange={handleChange}
        />

        <input
          name="minOrderAmount"
          placeholder="Min Order Amount"
          value={form.minOrderAmount}
          onChange={handleChange}
        />

        <input
          type="date"
          name="expiryDate"
          value={form.expiryDate}
          onChange={handleChange}
        />

        <input
          name="usageLimit"
          placeholder="Usage Limit"
          value={form.usageLimit}
          onChange={handleChange}
        />

        <button className="create-btn" onClick={handleCreate}>
          Create Coupon
        </button>
      </div>

      {/* TABLE */}
      <table className="coupon-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Type</th>
            <th>Value</th>
            <th>Min Amount</th>
            <th>Expiry</th>
            <th>Limit</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {coupons.length === 0 ? (
            <tr>
              <td colSpan="8">No coupons found</td>
            </tr>
          ) : (
            coupons.map((c) => (
              <tr key={c.id}>
                <td>{c.code}</td>
                <td>{c.discountType}</td>
                <td>{c.discountValue}</td>
                <td>₹{c.minOrderAmount}</td>
                <td>
                  {c.expiryDate
                    ? new Date(c.expiryDate).toLocaleDateString()
                    : "-"}
                </td>
                <td>{c.usageLimit}</td>

                <td>
                  <span
                    className={`status ${c.active ? "active" : "inactive"}`}
                  >
                    {c.active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td>
                  <button
                    className={`toggle-btn ${c.active ? "disable" : "enable"}`}
                    onClick={() => handleToggle(c.id, c.active)}
                  >
                    {c.active ? "Disable" : "Enable"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCouponPage;
