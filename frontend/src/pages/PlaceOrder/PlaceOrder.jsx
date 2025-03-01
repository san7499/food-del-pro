import { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";  // Ensure the CSS file exists
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
    const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);
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
        phone: ""
    });

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(prevData => ({ ...prevData, [name]: value }));
    };

    const placeOrder = async (event) => {
        event.preventDefault();

        if (!token) {
            alert("Please log in to place an order.");
            return navigate('/login');
        }

        let orderItems = [];
        if (food_list && cartItems) {
            orderItems = food_list.filter(item => cartItems[item._id] > 0)
                .map(item => ({ ...item, quantity: cartItems[item._id] }));
        }

        if (orderItems.length === 0) {
            alert("Your cart is empty.");
            return navigate('/cart');
        }

        const orderData = {
            address: data,
            items: orderItems,
            amount: getTotalCartAmount() + 2,
        };

        try {
            console.log("Placing order with data:", orderData);
            const response = await axios.post(`${url}/api/order/place`, orderData, { headers: { token } });

            if (response.data.success) {
                window.location.replace(response.data.session_url);
            } else {
                alert("Error placing order: " + response.data.message);
            }
        } catch (error) {
            console.error("Error placing order:", error);
            alert("An error occurred while placing the order. Please try again.");
        }
    };

    useEffect(() => {
        if (!token || getTotalCartAmount() === 0) {
            navigate('/cart');
        }
    }, [token, getTotalCartAmount, navigate]);

    const subtotal = getTotalCartAmount();
    const deliveryFee = subtotal > 0 ? 2.00 : 0;
    const total = subtotal + deliveryFee;

    return (
        <div>
            <form className="place-order" onSubmit={placeOrder}>
                <div className="place-order-left">
                    <p className="title">Delivery Information</p>
                    <div className="multi-fields">
                        <input name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder="First name" required />
                        <input name="lastName" onChange={onChangeHandler} value={data.lastName} type="text" placeholder="Last name" required />
                    </div>
                    <input name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Email address" required />
                    <input name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder="Street" required />
                    <div className="multi-fields">
                        <input name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder="City" required />
                        <input name="state" onChange={onChangeHandler} value={data.state} type="text" placeholder="State" required />
                    </div>
                    <div className="multi-fields">
                        <input name="zipcode" onChange={onChangeHandler} value={data.zipcode} type="text" placeholder="Zip code" required />
                        <input name="country" onChange={onChangeHandler} value={data.country} type="text" placeholder="Country" required />
                    </div>
                    <input name="phone" onChange={onChangeHandler} value={data.phone} type="tel" placeholder="Phone" required />
                </div>

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
                        <button type="submit">PROCEED TO PAYMENT</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PlaceOrder;
