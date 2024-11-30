import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MenuCard.css";
import NavBar from "../../components/NavBar/NavBar.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../../hooks/usecart.js";

const MenuCard = () => {
  const auth = useAuth();
  const { user } = auth;
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const returnUrl = params.get("returnUrl");

  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("");
  const [menu, setMenu] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({ food: "", price: "", description: "" });

  const { addToCart, cart } = useCart();

  useEffect(() => {
    if (!user) return;
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(`/api/restaurants/${user.id}`);
        setRestaurants(response.data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };
    fetchRestaurants();
  }, [user]);

  const handleSelectChange = (event) => {
    setSelectedRestaurantId(event.target.value);
  };

  const handleMenuClick = async () => {
    if (selectedRestaurantId) {
      try {
        const response = await axios.get(`/api/restaurants/${selectedRestaurantId}/menu`);
        setMenu(response.data);
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await axios.delete(`/api/restaurants/${selectedRestaurantId}/menu/${itemId}`);
      setMenu(menu.filter(item => item._id !== itemId));
    } catch (error) {
      console.error("Error removing menu item:", error);
    }
  };

  const handleAddItem = async () => {
    try {
      const response = await axios.post(`/api/restaurants/${selectedRestaurantId}`, newItem);
      setMenu([...menu, response.data]);
      setShowModal(false);
      setNewItem({ food: "", price: "", description: "" });
    } catch (error) {
      console.error("Error adding menu item:", error);
    }
  };

  return (
    <>
      <NavBar />
      <div className="MenuCardContainer">
        <div className="menu-restaurant-select">
          <h2>Select a Restaurant</h2>
          <div className="menu-select-container">
            <select
              value={selectedRestaurantId}
              onChange={handleSelectChange}
              className="menu-restaurant-select-dropdown"
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
            <button className="get-menu-button" onClick={handleMenuClick}>
              Get Menu
            </button>
          </div>
        </div>
          <div className="restaurant-menu-container">
            <div className="restaurant-menu">
              <h2>Menu</h2>
              <button className="add-item-button" onClick={() => setShowModal(true)}>
                Add Item
              </button>
              <ul className="restaurant-menu-list">
                {menu.map((item, index) => (
                  <li key={index}>
                    <div className="menu-item">
                      <div className="food">{item.food}</div>
                      <div className="description">{item.description}</div>
                      <div className="price">Price: ${item.price}</div>
                      <button
                        className="remove-item-button"
                        onClick={() => handleRemoveItem(item._id)}
                      >
                        Remove Item
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add Menu Item</h2>
            <label>
              Food:
              <input
                type="text"
                value={newItem.food}
                onChange={(e) => setNewItem({ ...newItem, food: e.target.value })}
              />
            </label>
            <label>
              Price:
              <input
                type="number"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              />
            </label>
            <label>
              Description:
              <input
                type="text"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              />
            </label>
            <button onClick={handleAddItem}>Add Item</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuCard;

// const response=await auth.addmenu(newItem, selectedRestaurantId);
