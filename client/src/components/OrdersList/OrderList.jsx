import React, { useEffect, useState } from 'react';
import './OrderList.css'; // Import your CSS file
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const { restaurantId } = useParams();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`/api/restaurants/${restaurantId}/order`);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [restaurantId]);

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await axios.put(`/api/restaurants/${restaurantId}/order/${orderId}`, { status });
      setOrders(orders.map(order => order._id === orderId ? { ...order, status: response.data.status } : order));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div className="OrderList"> 
      <h2>Orders</h2>
      <ul>
        {orders.map((order, index) => (
          <li key={index} className={`order-item ${order.status}`}>
            <strong>Order ID:</strong> {order._id} <br />
            <strong>Status:</strong> {order.status} <br />
            <Link to={`/restaurant/${restaurantId}/${order._id}`}>View Details</Link>
            {order.status === 'pending' && (
              <>
                <button onClick={() => updateOrderStatus(order._id, 'completed')}>Accept</button>
                <button onClick={() => updateOrderStatus(order._id, 'cancelled')}>Cancel</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderList;
