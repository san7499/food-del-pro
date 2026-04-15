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
      console.error("Error fetching orders:", error.response?.data || error.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetchOrders();
  }, [token]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>

 
      {loading && <p>Loading orders...</p>}


      {!loading && orders.length === 0 && (
        <p>No orders found.</p>
      )}

      <div className="container">
        {orders.map((order) => (
          <div key={order?._id} className="my-orders-order">
            <img src={assets.parcel_icon} alt="Parcel Icon" />


            <p>
              {order?.items
                ?.map((item) => `${item?.name} x ${item?.quantity}`)
                .join(", ")}
            </p>


            <p>${order?.amount?.toFixed(2)}</p>


            <p>Items: {order?.items?.length}</p>

 
            <p>
              <span>&#x25cf;</span>{" "}
              <b>{order?.status || "Processing"}</b>
            </p>


            <button onClick={fetchOrders}>
              Refresh Status
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
