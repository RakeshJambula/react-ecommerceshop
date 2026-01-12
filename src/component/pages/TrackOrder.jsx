import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ApiService from "../../service/ApiService";
import "../../style/trackOrder.css";

const TrackOrder = () => {
  const { orderId } = useParams();
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const data = await ApiService.getOrderTimeline(orderId);
        setTimeline(data);
      } catch (error) {
        console.error("Error fetching timeline", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, [orderId]);

  if (loading) return <p className="loading">Loading order timeline...</p>;

  return (
    <div className="track-container">
      <h2>📦 Track Order #{orderId}</h2>

      {timeline.length === 0 ? (
        <p>No tracking updates available.</p>
      ) : (
        <div className="timeline">
          {timeline.map((item, index) => (
            <div key={item.id} className="timeline-item">
              <div className="timeline-dot"></div>

              <div className="timeline-content">
                <h4>{item.status}</h4>
                <p>{item.comment}</p>
                <span>{new Date(item.timestamp).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
