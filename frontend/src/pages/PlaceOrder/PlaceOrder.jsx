import { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list = [], cartItems = {}, url } =
    useContext(StoreContext);

  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  // ✅ Handle input
  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Place Order
  const placeOrder = async (event) => {
    event.preventDefault();

    // 🔴 Validation
    if (!token) {
      alert("Please login first");
      navigate("/");
      return;
    }

    if (getTotalCartAmount() === 0) {
      alert("Cart is empty");
      navigate("/cart");
      return;
    }

    // ✅ Safe cart items
    const orderItems = food_list
      ?.filter((item) => (cartItems?.[item?._id] || 0) > 0)
      .map((item) => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        quantity: cartItems?.[item?._id] || 0,
      }));

    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    };

    try {
      setLoading(true);

      console.log("Order Data:", orderData);

      const response = await axios.post(
        `${url}/api/order/place`,
        orderData,
        { headers: { token } }
      );

      if (response.data?.success) {
        // ✅ Redirect to payment page
        window.location.replace(response.data.session_url);
      } else {
        alert(response.data?.message || "Order failed");
      }
    } catch (error) {
      console.error("Order Error:", error.response?.data || error.message);

      alert(
        error.response?.data?.message ||
          "Server error (500). Backend issue."
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Redirect protection
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal > 0 ? 2 : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="place-order-container">
      <form className="place-order" onSubmit={placeOrder}>
        {/* LEFT SIDE */}
        <div className="place-order-left">
          <p className="title">Delivery Information</p>

          <div className="multi-fields">
            <input name="firstName" onChange={onChangeHandler} value={data.firstName} placeholder="First name" required />
            <input name="lastName" onChange={onChangeHandler} value={data.lastName} placeholder="Last name" required />
          </div>

          <input name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Email" required />
          <input name="street" onChange={onChangeHandler} value={data.street} placeholder="Street" required />

          <div className="multi-fields">
            <input name="city" onChange={onChangeHandler} value={data.city} placeholder="City" required />
            <input name="state" onChange={onChangeHandler} value={data.state} placeholder="State" required />
          </div>

          <div className="multi-fields">
            <input name="zipcode" onChange={onChangeHandler} value={data.zipcode} placeholder="Zipcode" required />
            <input name="country" onChange={onChangeHandler} value={data.country} placeholder="Country" required />
          </div>

          <input name="phone" onChange={onChangeHandler} value={data.phone} placeholder="Phone" required />
        </div>

        {/* RIGHT SIDE */}
        <div className="place-order-right">
          <div className="cart-total">
            <h2>Cart Totals</h2>

            <div>
              <div className="cart-total-details">
                <p>Subtotal</p>
                <p>${subtotal.toFixed(2)}</p>
              </div>

              <hr />

              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>${deliveryFee.toFixed(2)}</p>
              </div>

              <hr />

              <div className="cart-total-details">
                <b>Total</b>
                <b>${total.toFixed(2)}</b>
              </div>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Processing..." : "PROCEED TO PAYMENT"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;
