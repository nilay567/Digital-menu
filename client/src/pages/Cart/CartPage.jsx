import React, { useState, useEffect } from "react";
import "./CartPage.css";
import { useCart } from "../../hooks/usecart";
import { useAuth } from "../../hooks/useAuth.js";
import Title from "../../components/Title/Title.jsx";
import { Link, useParams } from "react-router-dom";
import Price from "../../components/Price/Price.jsx";
import NotFound from "../../components/NotFound/NotFound.jsx";
import axios from "axios";
import NavBar from "../../components/NavBar/NavBar.jsx";

const CartPage = () => {
  const { cart, removeFromCart, changeQuantity } = useCart();
  const { selectedRestaurantId } = useParams();
  const { user } = useAuth();

  const [promotions, setPromotions] = useState([]);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [discountedTotal, setDiscountedTotal] = useState(cart.totalPrice);

  useEffect(() => {
    // Fetch promotions for the selected restaurant
    const fetchPromotions = async () => {
      try {
        const response = await axios.get(
          `/api/restaurants/${selectedRestaurantId}/promotions`
        );
        setPromotions(response.data);
      } catch (error) {
        console.error("Error fetching promotions:", error);
      }
    };

    fetchPromotions();
  }, [selectedRestaurantId]);

  useEffect(() => {
    if (selectedPromotion) {
      const discount =
        (cart.totalPrice * selectedPromotion.discountPercentage) / 100;
      setDiscountedTotal(cart.totalPrice - discount);
    } else {
      setDiscountedTotal(cart.totalPrice);
    }
  }, [selectedPromotion, cart.totalPrice]);

  return (
    <>
      <NavBar />
      <Title title="Cart Page" margin="1.5rem 0 0 2.5rem" />
      {cart.items.length === 0 ? (
        <NotFound message="Cart Page Is Empty!" />
      ) : (
        <div className="CartContainer">
          <ul className="CartList">
            {cart.items.map((item) => (
              <li key={item.food}>
                <div style={{ fontSize: "larger" }}>{item.food}</div>
                <div>
                  <select
                    value={item.quantity}
                    onChange={(e) =>
                      changeQuantity(item.food, Number(e.target.value))
                    }
                  >
                    {[...Array(10).keys()].map((n) => (
                      <option key={n + 1} value={n + 1}>
                        {n + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Price price={item.price} />
                </div>
                <div>
                  <button
                    className="remove_button"
                    onClick={() => removeFromCart(item.food)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="cartCheckout">
            <div>
              <div className="foods_count">{cart.totalCount}</div>
              <div className="total_price">
                <Price price={discountedTotal} />
              </div>
            </div>

            <div className="promotionSelector">
              <label htmlFor="promotion">Select Promotion:</label>
              <select
                id="promotion"
                value={selectedPromotion ? selectedPromotion._id : ""}
                onChange={(e) => {
                  const promo = promotions.find(
                    (promo) => promo._id === e.target.value
                  );
                  setSelectedPromotion(promo);
                }}
              >
                <option value="">None</option>
                {promotions.map((promo) => (
                  <option key={promo._id} value={promo._id}>
                    {promo.title}  {promo.discountPercentage}%
                  </option>
                ))}
              </select>
            </div>

            <Link
              to={`/checkout/${selectedRestaurantId}?promotionId=${
                selectedPromotion ? selectedPromotion._id : ""
              }`}
            >
              Confirm Order
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default CartPage;
