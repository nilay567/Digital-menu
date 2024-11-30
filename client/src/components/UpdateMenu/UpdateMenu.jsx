import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useParams } from "react-router-dom";
import './UpdateMenu.css'

const UpdateMenu = () => {
  const auth = useAuth();
  const { user } = auth;
  const { restaurantId } = useParams();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    food: "",
    description: "",
    price: "",
  });

  const handleOpenForm = () => {
    setIsFormVisible(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle the restaurant creation logic here
    console.log("Item added:", formData);
    await auth.addmenu(formData, restaurantId);
    setIsFormVisible(false); // Hide form after submission
  };
  return (
    <div>
      <div className="menu-container">
        <button className="create-menu-button" onClick={handleOpenForm}>
          Add Items
        </button>
        {isFormVisible && (
          <div className="form-menu-container">
            <h2>Add items to the menu</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="food"
                placeholder="Name"
                value={formData.food}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                required
              />
              <button type="submit">Submit</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateMenu;
