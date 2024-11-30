import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './QrCodeGenerator.css'; // Make sure to create this CSS file for styling
import NavBar from "../../components/NavBar/NavBar.jsx";
import { useAuth } from '../../hooks/useAuth.js';
import { useNavigate, useSearchParams } from 'react-router-dom';

const QRCodeGenerator = () => {
  const auth = useAuth();
  const { user } = auth;
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const returnUrl = params.get("returnUrl");

  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
  const [qrCode, setQrCode] = useState('');

//   useEffect(() => {
//     if (!user) return;
//     returnUrl ? navigate(returnUrl) : navigate("/");
//   }, [user]);

  useEffect(() => {
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

  const handleSelectChange = (event) => {
    setSelectedRestaurantId(event.target.value);
  };

  const handleGenerateQRCode = async () => {
    if (selectedRestaurantId) {
      try {
        const response = await axios.get(`/api/restaurants/generateQRCode/${selectedRestaurantId}`);
        setQrCode(response.data.qrCode);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    }
  };

  return (
    <>
      <NavBar/>
      <div className="QRCodeGeneratorContainer">
        <h2>Generate QR Code for a Restaurant</h2>
        <select value={selectedRestaurantId} onChange={handleSelectChange}>
          <option value="" disabled>Select a restaurant</option>
          {restaurants.map((restaurant) => (
            <option key={restaurant._id} value={restaurant._id}>
              {restaurant.name}
            </option>
          ))}
        </select>
        <button className="generate-button" onClick={handleGenerateQRCode}>
          Generate QR Code
        </button>

        {qrCode && (
          <div className="qrCodeContainer">
            <h2>Scan this QR Code to view the menu</h2>
            <img src={qrCode} alt="QR Code" />
          </div>
        )}
      </div>
    </>
  );
};

export default QRCodeGenerator;
