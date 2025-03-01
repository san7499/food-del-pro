import { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";  // Ensure the CSS file exists
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
    const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);

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
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };

    const placeOrder = async (event) => {
        event.preventDefault();
        let orderItems = [];
        food_list.forEach((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = { ...item };
                itemInfo["quantity"] = cartItems[item._id];
                orderItems.push(itemInfo);
            }
        });
        let orderData = {
            address: data,
            items: orderItems,
            amount: getTotalCartAmount() + 2,
        };

        try {
            console.log("Placing order with data:", orderData);
            let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
            console.log("Order response:", response);

            if (response.data.success) {
                const { session_url } = response.data;
                window.location.replace(session_url);
            } else {
                console.error("Server error message:", response.data.message);
                alert("Error placing order: " + response.data.message);
            }
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Error placing order. Please try again.");
        }
    };

    const subtotal = getTotalCartAmount();
    const deliveryFee = subtotal > 0 ? 2.00 : 0; // Delivery fee only if cart is not empty
    const total = subtotal + deliveryFee;

    const navigate = useNavigate();
    useEffect(()=>{
        if (!token) {
            navigate('/cart')
        }else if(getTotalCartAmount===0){
            navigate('/cart')
        }
    },[token])

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
