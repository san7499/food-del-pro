import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);


  const url = "https://food-del-backend-yyi8.onrender.com";


  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev?.[itemId] || 0) + 1,
    }));

    try {
      if (token) {
        await axios.post(
          `${url}/api/cart/add`,
          { itemId },
          { headers: { token } }
        );
      }
    } catch (error) {
      console.error("Add to cart error:", error.response?.data || error.message);
    }
  };


  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      if (!prev?.[itemId]) return prev;

      const updatedCart = {
        ...prev,
        [itemId]: prev[itemId] - 1,
      };

      if (updatedCart[itemId] === 0) {
        delete updatedCart[itemId];
      }

      return updatedCart;
    });

    try {
      if (token) {
        await axios.post(
          `${url}/api/cart/remove`,
          { itemId },
          { headers: { token } }
        );
      }
    } catch (error) {
      console.error("Remove from cart error:", error.response?.data || error.message);
    }
  };

  
  const getTotalCartAmount = () => {
    let totalAmount = 0;

    for (const item in cartItems || {}) {
      if (cartItems[item] > 0) {
        const itemInfo = food_list.find(
          (product) => product?._id === item
        );

        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }

    return totalAmount;
  };


  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      setFoodList(response.data?.data || []);
    } catch (error) {
      console.error("Fetch food error:", error.response?.data || error.message);
      setFoodList([]);
    }
  };


  const loadCartData = async (token) => {
    try {
      const response = await axios.post(
        `${url}/api/cart/get`,
        {},
        { headers: { token } }
      );

      setCartItems(response.data?.cartData || {});
    } catch (error) {
      console.error("Load cart error:", error.response?.data || error.message);
      setCartItems({});
    }
  };


  useEffect(() => {
    const loadData = async () => {
      await fetchFoodList();

      const savedToken = localStorage.getItem("token");

      if (savedToken) {
        setToken(savedToken);
        await loadCartData(savedToken);
      } else {
        setCartItems({});
      }
    };

    loadData();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
