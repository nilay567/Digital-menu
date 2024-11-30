import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import "./PaymentSuccess.css";
import NavBar from '../../components/NavBar/NavBar';


const PaymentSuccess = () => {
  const location = useLocation();
  const { user } = useAuth();

  const params = new URLSearchParams(location.search);
  const sessionId = params.get("session_id");
  const selectedRestaurantId = params.get("selectedRestaurantId");
  const orderId = params.get("orderId");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        await axios.put(
          `/api/payment/${selectedRestaurantId}/order/${orderId}/payment-status`
        );

        const response = await axios.get(
          `/api/restaurants/${selectedRestaurantId}/order/${orderId}`
        );
        setOrder(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [orderId, selectedRestaurantId]);

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <NavBar/>
    <div className="payment-success">
      <h1>Payment Successful</h1>
      <p>Your order has been placed successfully.</p>
      <div className="order-details">
        <h2>Order Details</h2>
        <p>
          <strong>Order ID:</strong> {order._id}
        </p>
        <p>
          <strong>Status:</strong> {order.status}
        </p>
        <p>
          <strong>Payment Status:</strong> {order.paymentStatus}
        </p>
        <p>
          <strong>Table Number:</strong> {order.tableNumber}
        </p>
        <p>
          <strong>Description:</strong> {order.description}
        </p>
        <ul>
          {order.items.map((item, index) => (
            <li key={index} className="order-item">
              <span>{item.food} x {item.quantity}</span>
              <span>${item.price}</span>
            </li>
          ))}
        </ul>
        <div className="order-total">
          <p>
            <strong>Total Count:</strong> {order.totalCount}
          </p>
          <p>
            <strong>Total Price:</strong> ${order.totalPrice}
          </p>
        </div>
      </div>
    </div>
          </>
  );
};

export default PaymentSuccess;
