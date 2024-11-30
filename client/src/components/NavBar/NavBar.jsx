import React from "react";
import "./NavBar.css";
import { Link } from "react-router-dom";
import { useCart } from "../../hooks/usecart.js";
import { useAuth } from "../../hooks/useAuth.js";
import { useRestaurant } from "../../hooks/useRest.js";

const NavBar = () => {
  const { cart } = useCart();
  const { user } = useAuth();
  const { selectedRestaurantId } = useRestaurant();

  return (
    <header className="navbar">
      <div className="navBarcontainer">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            {user?.isAdmin ? (
              <>
                <li>
                  <Link to="/menu">Menu</Link>
                </li>
                <li>
                  <Link to="/restaurant">Restaurant</Link>
                </li>
                <li>
                  <Link to="/generate-qrcode">QR Code</Link>
                </li>
                <li>
                  <Link to="/orders">Orders</Link>
                </li>
                <li>
                  <Link to="/promotions">Promotions</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to={`/${selectedRestaurantId}/userMenu`}>Menu</Link>
                </li>
                <li>
                  <Link to="/scan-qrcode">Scanner</Link>
                </li>
                <li>
                  <Link to={`/${selectedRestaurantId}/orders`}>Orders</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
