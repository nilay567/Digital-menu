import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './OrderDetails.css'; // Import the CSS file for styling
import NavBar from '../../components/NavBar/NavBar';

const OrderDetails = () => {
  const { restaurantId, orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`/api/restaurants/${restaurantId}/order/${orderId}`);
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (!order) return <div>Loading...</div>;

  return (
    <>
    <NavBar/>
    <div className="OrderDetails">
      <h2>Order Details</h2>
      <p><strong>Order ID:</strong> {order._id}</p>
      <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Table Number:</strong> {order.tableNumber}</p>
      <p><strong>Description:</strong> {order.description}</p>
      <ul>
        {order.items.map((item, index) => (
          <li key={index}>
            <p>{item.food} x {item.quantity}</p>
            <p><strong>Price:</strong> ₹{item.price}</p>
          </li>
        ))}
      </ul>
      <div className="total">
        <p><strong>Total Count:</strong> {order.totalCount}</p>
        <p><strong>Total Price:</strong> ₹{order.totalPrice}</p>
      </div>
    </div>
        </>
  );
};

export default OrderDetails;
