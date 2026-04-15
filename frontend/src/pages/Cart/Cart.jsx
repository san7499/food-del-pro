import { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems = {}, food_list = [], removeFromCart, getTotalCartAmount, url } = useContext(StoreContext);
  const navigate = useNavigate();

  const subtotal = getTotalCartAmount ? getTotalCartAmount() : 0;
  const deliveryFee = subtotal > 0 ? 2.0 : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <hr />

        {food_list.length > 0 ? (
          food_list.map((item) => {
            const quantity = cartItems?.[item?._id] || 0;

            if (quantity > 0) {
              return (
                <div key={item?._id}>
                  <div className="cart-items-title cart-items-item">
                    <img
                      src={url + "/images/" + item?.image}
                      alt={item?.name || "Food Item"}
                    />
                    <p>{item?.name}</p>
                    <p>${parseFloat(item?.price || 0).toFixed(2)}</p>
                    <p>{quantity}</p>
                    <p>${(parseFloat(item?.price || 0) * quantity).toFixed(2)}</p>
                    <p
                      className="cross"
                      onClick={() => removeFromCart(item?._id)}
                    >
                      X
                    </p>
                  </div>
                  <hr />
                </div>
              );
            }
            return null;
          })
        ) : (
          <p className="empty-cart-message">Your cart is empty.</p>
        )}
      </div>

      {subtotal > 0 && (
        <div className="cart-bottom">
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
            <button onClick={() => navigate('/order')}>
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
