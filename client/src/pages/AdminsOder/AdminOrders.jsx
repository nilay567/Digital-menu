import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';  // Import your NavBar component if needed
import { useAuth } from '../../hooks/useAuth';
import './AdminOrder.css'
import Title from '../../components/Title/Title';

const AdminOrders = () => {
  const { user } = useAuth();  // Assuming you have a useAuth hook for user authentication
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
  const [orders, setOrders] = useState([]);
  
  const { restaurantId } = useParams();  // Get restaurantId from URL params if needed
  
  useEffect(() => {
    if (!user) return;

    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(`/api/restaurants/${user.id}`);
        setRestaurants(response.data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    fetchRestaurants();
  }, [user]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!selectedRestaurantId) return;

      try {
        const response = await axios.get(`/api/restaurants/${selectedRestaurantId}/order`);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [selectedRestaurantId]);

  const handleSelectChange = (event) => {
    setSelectedRestaurantId(event.target.value);
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await axios.put(`/api/restaurants/${selectedRestaurantId}/order/${orderId}`, { status });
      setOrders(orders.map(order => order._id === orderId ? { ...order, status: response.data.status } : order));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <>
      <NavBar />
      <div className="admin-orders-container">
        <div className="admin-restaurant-select-container">
          <h3 className="admin-restaurant-select-heading">Select a Restaurant</h3>
          <select
            value={selectedRestaurantId}
            onChange={handleSelectChange}
            className="admin-restaurant-select-dropdown"
          >
            <option value="" disabled>
              Select a restaurant
            </option>
            {restaurants.map(restaurant => (
              <option key={restaurant._id} value={restaurant._id}>
                {restaurant.name}
              </option>
            ))}
          </select>
        </div>

        {/* Display Orders */}
        <ul className="admin-orders-list">
          {orders.map((order, index) => (
            <li key={index} className={`admin-order-item ${order.status}`}>
              <strong className="admin-order-id">Order ID:</strong> {order._id} <br />
              <strong className="admin-order-status">Status:</strong> {order.status} <br />
              <Link to={`/orders/${selectedRestaurantId}/${order._id}`} className="view-details-link">View Order Details</Link>
              {order.status === 'pending' && (
                <div className="admin-order-actions">
                  <button onClick={() => updateOrderStatus(order._id, 'completed')} className="admin-accept-button">Accept</button>
                  <button onClick={() => updateOrderStatus(order._id, 'cancelled')} className="admin-cancel-button">Cancel</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default AdminOrders;
