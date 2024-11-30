import React, { useEffect, useState } from 'react';
import './UsersOrder.css'; 
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from "../../hooks/useAuth";
import NavBar from '../../components/NavBar/NavBar';
import { format } from 'date-fns';

const UsersOrder = () => {
  const [orders, setOrders] = useState([]);
  const { selectedRestaurantId } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`/api/restaurants/${selectedRestaurantId}/orderUser/${user.id}`);
        const sortedOrders = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sortedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [selectedRestaurantId, user.id]);

  return (
    <>
      <NavBar />
      <div className="UsersOrderList">
        <h2>Orders</h2>
        <ul>
          {orders.map((order, index) => (
            <li key={index} className={`usersOrder-item ${order.status}`}>
              <div className="order-header">
                <span className={`order-status ${order.status}`}>{order.status}</span>
                <span className={`payment-status ${order.paymentStatus}`}>{order.paymentStatus}</span>
              </div>
              <div className="order-details">
                {order.items.map((item, idx) => (
                  <div key={idx} >
                    <p>{item.quantity} x {item.food}</p>
                  </div>
                ))}
              </div>
              <div className="order-footer">
                <p className="order-date">{format(new Date(order.createdAt), 'dd MMM yyyy, hh:mm a')}</p>
                <p className="order-total">₹{order.totalPrice.toFixed(2)}</p>
              </div>
              <div className="order-actions">
                <hr className="order-divider" />
                <br/>
                <Link to={`/reorder/${selectedRestaurantId}/${order._id}`}>
                  <button className="reorder-btn">Reorder</button>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default UsersOrder;
