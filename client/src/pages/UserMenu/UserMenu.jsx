import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../../components/NavBar/NavBar.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../../hooks/usecart.js";
import { useRestaurant } from "../../hooks/useRest.js";
import "./UserMenu.css";

const UserMenu = () => {
  const auth = useAuth();
  const { user } = auth;
  const { selectedRestaurantId } = useParams();
  const { setSelectedRestaurantId } = useRestaurant();

  const [menu, setMenu] = useState([]);
  const { addToCart, cart } = useCart();

  useEffect(() => {
    if (!user || !selectedRestaurantId) return;

    setSelectedRestaurantId(selectedRestaurantId);

    const fetchMenu = async () => {
      try {
        const response = await axios.get(
          `/api/restaurants/${selectedRestaurantId}/menu`
        );
        setMenu(response.data);
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };

    fetchMenu();
  }, [user, selectedRestaurantId, setSelectedRestaurantId]);

  return (
    <>
      <NavBar />
      <div className="MenuCardContainer">
        {selectedRestaurantId ? (
          menu.length > 0 ? (
            <div className="restaurant-menu-container">
              <div className="restaurant-menu">
                <h2>Menu</h2>
                <div className="go_to_cart_button">
                  <Link to={`/cart/${selectedRestaurantId}`}>
                    Cart
                    {cart.totalCount > 0 && (
                      <span className="cart_count">{cart.totalCount}</span>
                    )}
                  </Link>
                </div>
                <ul className="restaurant-menu-list">
                  {menu.map((item, index) => (
                    <li key={index}>
                      <div className="menu-item">
                        <div className="food">{item.food}</div>
                        <div className="description">{item.description}</div>
                        <div className="price">Price: ${item.price}</div>
                        <button
                          className="remove-item-button"
                          onClick={() => addToCart(item)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                
              </div>
            </div>
          ) : (
            <div>No menu available.</div>
          )
        ) : (
          <div className="no-restaurant-id-container">
            <h2>No Restaurant Selected</h2>
            <Link to="/scan-qrcode">
              <button className="scan-qr-button">Scan QR Code</button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default UserMenu;