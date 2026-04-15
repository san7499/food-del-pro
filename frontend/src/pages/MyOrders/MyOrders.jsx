import { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ Fetch Orders (SAFE)
  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${url}/api/order/userorders`,
        {},
        { headers: { token } }
      );

      if (response.data?.success) {
        setOrders(response.data.data || []);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error(
        "Error fetching orders:",
        error.response?.data || error.message
      );
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load Orders when token available
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    fetchOrders();
  }, [token, navigate]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>

      {/* ✅ Loading State */}
      {loading && <p>Loading orders...</p>}

      {/* ✅ Empty State */}
      {!loading && orders.length === 0 && (
        <p>No orders found.</p>
      )}

      <div className="container">
        {orders?.map((order) => (
          <div key={order?._id} className="my-orders-order">
            <img src={assets.parcel_icon} alt="Parcel Icon" />

            {/* ✅ Items List */}
            <p>
              {order?.items
                ?.map(
                  (item) =>
                    `${item?.name || "Item"} x ${
                      item?.quantity || 0
                    }`
                )
                .join(", ")}
            </p>

            {/* ✅ Amount */}
            <p>${(order?.amount || 0).toFixed(2)}</p>

            {/* ✅ Item Count */}
            <p>Items: {order?.items?.length || 0}</p>

            {/* ✅ Status */}
            <p>
              <span>&#x25cf;</span>{" "}
              <b>{order?.status || "Processing"}</b>
            </p>

            {/* ✅ Refresh Button */}
            <button onClick={fetchOrders} disabled={loading}>
              {loading ? "Refreshing..." : "Refresh Status"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
