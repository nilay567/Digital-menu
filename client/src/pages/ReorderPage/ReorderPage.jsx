import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";
import axios from "axios";
import NavBar from "../../components/NavBar/NavBar";
import Title from "../../components/Title/Title";
import OrderItemsList from "../../components/OrderItemsList/OrderItemsList";
import "./ReorderPage.css";

import { loadStripe } from "@stripe/stripe-js";
import ReOrderItemList from "../../components/ReOrderItemList/ReOrderItemList";
const stripePromise = loadStripe("pk_test_51PXdbsKsLOwdkUkUL1e78Ki8NUsVxOat3zMA6SYNejFFPbJ7qHTKJzve2NeZBkrp32MydGnzbJrWHclsOCnUtivt00xfBi2Jgh");

const ReorderPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { selectedRestaurantId, orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [menu, setMenu] = useState([]);
  const [tableNumber, setTableNumber] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`/api/restaurants/${selectedRestaurantId}/order/${orderId}`);
        setOrder(response.data);
        setTableNumber(response.data.tableNumber);
        setDescription(response.data.description);
      } catch (error) {
        console.error('Error fetching order:', error);
        toast.error('Failed to fetch order details.');
      }
    };

    const fetchMenu = async () => {
      try {
        const response = await axios.get(`/api/restaurants/${selectedRestaurantId}/menu`);
        setMenu(response.data);
      } catch (error) {
        console.error('Error fetching menu:', error);
        toast.error('Failed to fetch restaurant menu.');
      }
    };

    fetchOrder();
    fetchMenu();
  }, [selectedRestaurantId, orderId]);

  const createOrder = async () => {
    const orderItems = order.items.map(item => ({
      food: item.food,
      price: item.price,
      quantity: item.quantity,
    }));

    // Check if all items in the order are available in the menu
    const unavailableItems = orderItems.filter(
      orderItem => !menu.some(menuItem => menuItem.food === orderItem.food)
    );

    if (unavailableItems.length > 0) {
      toast.error("Some items are not available in the restaurant's menu.");
      return;
    }

    const orderDetails = {
      userId: user.id,
      items: orderItems,
      description,
      tableNumber,
      totalCount: order.totalCount,
      totalPrice: order.totalPrice,
    };

    const response = await axios.post(`/api/restaurants/${selectedRestaurantId}/order`, orderDetails);
    const { orderId } = response.data;
    console.log("Order created successfully");
    return orderId;
  };

  const makePayment = async (orderId) => {
    const stripe = await stripePromise;

    const response = await fetch(
      `https://digimenu-1.onrender.com/api/payment/create-checkout-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderItems: order.items,
          selectedRestaurantId,
          orderId,
        }),
      }
    );

    const session = await response.json();
    const result = stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) console.log(result.error);
  };

  const handleCheckout = async () => {
    try {
      const newOrderId = await createOrder();
      if (newOrderId) {
        await makePayment(newOrderId);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Checkout failed. Please try again.");
    }
  };

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavBar />
      <div className="checkoutContent">
        <Title title="Reorder Form" fontSize="1.6rem" />
        <div className="checkoutInputs">
          <label>
            Table Number:
            <input
              type="text"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
            />
          </label>
          <label>
            Description:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
        </div>
        <ReOrderItemList order={order} />
        <div className="checkout_buttons_container">
          <div className="checkoutButtons">
            <button onClick={handleCheckout}>Go To Payment</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReorderPage;
