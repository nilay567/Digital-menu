import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PromotionPage.css';
import NavBar from '../../components/NavBar/NavBar';
import { useAuth } from '../../hooks/useAuth';
import { useSearchParams } from 'react-router-dom';

const PromotionsPage = () => {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(params.get("selectedRestaurantId") || "");
  const [promotions, setPromotions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newPromotion, setNewPromotion] = useState({ title: '', description: '', discountPercentage: 0, startDate: '', endDate: '' });

  useEffect(() => {
    if (!user) return;
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(`/api/restaurants/${user.id}`);
        setRestaurants(response.data);
        if (!selectedRestaurantId && response.data.length > 0) {
          setSelectedRestaurantId(response.data[0]._id);
        }
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };
    fetchRestaurants();
  }, [user]);

  useEffect(() => {
    if (!selectedRestaurantId) return;
    const fetchPromotions = async () => {
      try {
        const response = await axios.get(`/api/restaurants/${selectedRestaurantId}/promotions`);
        setPromotions(response.data);
      } catch (error) {
        console.error('Error fetching promotions:', error);
      }
    };

    fetchPromotions();
  }, [selectedRestaurantId]);

  const handleSelectChange = (event) => {
    setSelectedRestaurantId(event.target.value);
  };

  const handleCreatePromotion = async () => {
    try {
      const response = await axios.post(`/api/restaurants/${selectedRestaurantId}/promotions`, newPromotion);
      setPromotions([...promotions, response.data]);
      setShowModal(false);
      setNewPromotion({ title: '', description: '', discountPercentage: 0, startDate: '', endDate: '' });
    } catch (error) {
      console.error('Error creating promotion:', error);
    }
  };

  const handleDeletePromotion = async (promotionId) => {
    try {
      await axios.delete(`/api/restaurants/${selectedRestaurantId}/promotions/${promotionId}/delete`);
      setPromotions(promotions.filter(promotion => promotion._id !== promotionId));
    } catch (error) {
      console.error('Error deleting promotion:', error);
    }
  };

  const handleChange = (e) => {
    setNewPromotion({ ...newPromotion, [e.target.name]: e.target.value });
  };

  return (
    <>
      <NavBar />
      <div className="PromotionsPageContainer">
        <div className="promotion-header">
          <h2>Select a Restaurant</h2>
          <div className="promotion-select-container">
            <select
              value={selectedRestaurantId}
              onChange={handleSelectChange}
              className="promotion-restaurant-select-dropdown"
            >
              <option value="" disabled>
                Select a restaurant
              </option>
              {restaurants.map((restaurant) => (
                <option key={restaurant._id} value={restaurant._id}>
                  {restaurant.name}
                </option>
              ))}
            </select>
            <button className="create-promotion-button" onClick={() => setShowModal(true)}>
              Create Promotion
            </button>
          </div>
        </div>

        <div className="promotion-list">
          <h2>Promotions</h2>
          <ul className="promotion-items">
            {promotions.map((promotion) => (
              <li key={promotion._id}>
                <div className="promotion-item">
                  <h3>{promotion.title}</h3>
                  <p>{promotion.description}</p>
                  <p>Discount: {promotion.discountPercentage}%</p>
                  <p>
                    Valid from: {new Date(promotion.startDate).toLocaleDateString()} to{' '}
                    {new Date(promotion.endDate).toLocaleDateString()}
                  </p>
                  <button className="delete-promotion-button" onClick={() => handleDeletePromotion(promotion._id)}>
                    Delete Promotion
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create Promotion</h2>
            <label>
              Title:
              <input type="text" name="title" value={newPromotion.title} onChange={handleChange} />
            </label>
            <label>
              Description:
              <textarea
                name="description"
                value={newPromotion.description}
                onChange={handleChange}
              ></textarea>
            </label>
            <label>
              Discount Percentage:
              <input
                type="number"
                name="discountPercentage"
                value={newPromotion.discountPercentage}
                onChange={handleChange}
              />
            </label>
            <label>
              Start Date:
              <input
                type="date"
                name="startDate"
                value={newPromotion.startDate}
                onChange={handleChange}
              />
            </label>
            <label>
              End Date:
              <input
                type="date"
                name="endDate"
                value={newPromotion.endDate}
                onChange={handleChange}
              />
            </label>
            <div>
              <button className="create-promotion-btn" onClick={handleCreatePromotion}>
                Create Promotion
              </button>
              <button className="cancel-btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PromotionsPage;
