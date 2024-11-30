import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import axios from "axios";

const CartContext = createContext(null);
const CART_KEY_PREFIX = "cart_";
const EMPTY_CART = {
  items: [],
  totalPrice: 0,
  totalCount: 0,
};

export default function CartProvider({ children }) {
  // const { user } = useAuth();
  const userCartKey = `${CART_KEY_PREFIX}`;

  const [cart, setCart] = useState(() => {
    if (userCartKey) {
      const storedCart = localStorage.getItem(userCartKey);
      return storedCart ? JSON.parse(storedCart) : EMPTY_CART;
    }
    return EMPTY_CART;
  });

  useEffect(() => {
    if (userCartKey) {
      localStorage.setItem(userCartKey, JSON.stringify(cart));
    }
  }, [cart, userCartKey]);

  const clearCart = () => setCart(EMPTY_CART);

  const addToCart = (food) => {
    setCart((prevCart) => {
      const existingItem = prevCart.items.find((item) => item.food === food.food);
      if (existingItem) {
        const updatedItems = prevCart.items.map((item) =>
          item.food === food.food ? { ...item, quantity: item.quantity + 1 } : item
        );
        return {
          ...prevCart,
          items: updatedItems,
          totalPrice: prevCart.totalPrice + food.price,
          totalCount: prevCart.totalCount + 1,
        };
      }
      return {
        ...prevCart,
        items: [...prevCart.items, { ...food, quantity: 1 }],
        totalPrice: prevCart.totalPrice + food.price,
        totalCount: prevCart.totalCount + 1,
      };
    });
  };

  const removeFromCart = (foodId) => {
    setCart((prevCart) => {
      const itemToRemove = prevCart.items.find((item) => item.food === foodId);
      const updatedItems = prevCart.items.filter((item) => item.food !== foodId);
      return {
        ...prevCart,
        items: updatedItems,
        totalPrice: prevCart.totalPrice - itemToRemove.price * itemToRemove.quantity,
        totalCount: prevCart.totalCount - itemToRemove.quantity,
      };
    });
  };

  const changeQuantity = (foodId, newQuantity) => {
    setCart((prevCart) => {
      const updatedItems = prevCart.items.map((item) =>
        item.food === foodId
          ? { ...item, quantity: newQuantity, price: (item.price / item.quantity) * newQuantity }
          : item
      );
      const totalPrice = updatedItems.reduce((total, item) => total + item.price, 0);
      const totalCount = updatedItems.reduce((total, item) => total + item.quantity, 0);
      return {
        ...prevCart,
        items: updatedItems,
        totalPrice,
        totalCount,
      };
    });
  };

  const submitOrder = async (orderDetails) => {
    try {
      // await axios.post('/api/restaurants', orderDetails);
      clearCart();
    } catch (error) {
      throw new Error('Error placing order');
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        changeQuantity,
        clearCart,
        submitOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
