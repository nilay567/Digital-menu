import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Restaurant.css";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar.jsx";
import { useAuth } from "../../hooks/useAuth.js";


const Restaurant = () => {
  const auth = useAuth();
  const { user } = auth;
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const returnUrl = params.get("returnUrl");
  
  const [restaurants, setRestaurants] = useState(null);
  useEffect(() => {
    if (user) return;
    returnUrl ? navigate(returnUrl) : navigate("/login");
  }, [user, navigate, returnUrl]);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(`api/restaurants/${user.id}`);
        setRestaurants(response.data);
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      }
    };

    fetchRestaurant();
  }, []);

  if (!restaurants) {
    return <div>Loading...</div>;
  }
  return (
    <>
    <NavBar/>
      <div className="restaurant-container">
        <ul className={"restaurant-list"}>
          {restaurants.map((restaurant) => (
            <li key={restaurant._id}>
              <Link to={`/restaurant`}>
              <div className="name">
                {restaurant.name}
                </div>
                <span className="location-icon">&#x1F4CC;     </span>
                  {restaurant.location}
              <div className="restaurantId">{restaurant._id}</div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Restaurant;
