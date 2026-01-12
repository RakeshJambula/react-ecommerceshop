import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import "../../style/notification.css";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    ApiService.getLoggedInUserInfo().then((res) => {
      setUserId(res.user.id);
    });
  }, []);

  useEffect(() => {
    if (userId) loadNotifications();
  }, [userId]);

  const loadNotifications = () => {
    ApiService.getUserNotifications(userId)
      .then(setNotifications)
      .catch(console.error);
  };

  const openNotification = async (n) => {
    if (!n.read) {
      await ApiService.markNotificationAsRead(n.id);
    }

    const orderId = n.message.match(/\d+/)?.[0];

    if (orderId) {
      navigate(`/track-order/${orderId}`);
    } else {
      loadNotifications();
    }
  };

  return (
    <div className="notification-container">
      <h2>🔔 Notifications</h2>

      {notifications.length === 0 && <p>No notifications</p>}

      {notifications.map((n) => (
        <div
          key={n.id}
          className={`notification-card ${n.read ? "read" : "unread"}`}
          onClick={() => openNotification(n)}
        >
          <p>{n.message}</p>
          <span>
            {n.timestamp ? new Date(n.timestamp).toLocaleString() : "No date"}
          </span>
        </div>
      ))}
    </div>
  );
};

export default NotificationsPage;
