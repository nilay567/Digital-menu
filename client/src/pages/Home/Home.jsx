import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import "./Home.css";
import NavBar from "../../components/NavBar/NavBar.jsx";

const Home = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const { user } = auth;
  const [params] = useSearchParams();
  const returnUrl = params.get("returnUrl");

  useEffect(() => {
    if (user) return;
    returnUrl ? navigate(returnUrl) : navigate("/login");
  }, [user, navigate, returnUrl]);

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    userId: user ? user.id : "",
  });

  const handleOpenForm = () => {
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSubmit = { ...formData, userId: user.id };
    console.log("Restaurant created:", dataToSubmit);
    await auth.createRestaurant(dataToSubmit);
    setIsFormVisible(false);
  };

  return (
    <>
      <NavBar />
      <div className="HomeContainer">
        {user?.isAdmin ? (
          <>
            <button className="create-button" onClick={handleOpenForm}>
              Create a Restaurant
            </button>
            {isFormVisible && (
              <div className="form-container">
                <div className="form-header">
                  <h2>Create a Restaurant</h2>
                  <button className="close-button" onClick={handleCloseForm}>
                    X
                  </button>
                </div>
                <form onSubmit={handleSubmit}>
                  <input
                  className="homeInput"
                    type="text"
                    name="name"
                    placeholder="Restaurant Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <input
                  className="homeInput"
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                  <button type="submit">Create</button>
                </form>
              </div>
            )}
          </>
        ) : (
          <Link to="/scan-qrcode">
            <button className="create-button">
              Scan QR
            </button>
          </Link>
        )}
      </div>
    </>
  );
};

export default Home;
