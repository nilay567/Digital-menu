import React, { createContext, useState, useContext, useEffect } from 'react';

const RestaurantContext = createContext(null);

export const useRestaurant = () => useContext(RestaurantContext);

export const RestaurantProvider = ({ children }) => {
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(
    () => sessionStorage.getItem('selectedRestaurantId') || null
  );

  useEffect(() => {
    sessionStorage.setItem('selectedRestaurantId', selectedRestaurantId);
  }, [selectedRestaurantId]);

  return (
    <RestaurantContext.Provider value={{ selectedRestaurantId, setSelectedRestaurantId }}>
      {children}
    </RestaurantContext.Provider>
  );
};
