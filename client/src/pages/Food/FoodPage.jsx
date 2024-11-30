import React, { useEffect, useState } from "react";
import "./FoodPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { getById } from "../../services/foodService.js";
import StarRating from "../../components/StarRating/StarRating.jsx";
import Tags from "../../components/Tags/Tags.jsx";
import Price from "../../components/Price/Price.jsx";
import { useCart } from "../../hooks/usecart.js";
import NotFound from "../../components/NotFound/NotFound.jsx";

const FoodPage = () => {
  const [food, setFood] = useState({});
  const { id } = useParams();
  const {addToCart} = useCart();
  const navigate = useNavigate();

  const handleAddToCart = ()=>{
    addToCart(food);
    navigate('/cart');
  }

  useEffect(() => {
    getById(id).then(setFood);
  }, [id]);

  return (
    <>
      {!food? (<NotFound message="Food Not Found!" linkText="Back to Homepage"/>) : (
        <div className="foodContainer">
          <img
            className="foodImage"
            src={`${food.imageUrl}`}
            alt={food.name}
          />

          <div className="foodDetails">
            <div className="foodHeader">
              <span className="foodName">{food.name}</span>
              <span
                className={`${"Favorite"} ${
                    food.favorite ? "" : "not"
                  }`}
              >
                ❤
              </span>
            </div>
            <div className="rating">
              <StarRating stars={food.stars} size={25} />
            </div>

            <div className="foodOrigins">
              {food.origins?.map(origin => (
                <span key={origin}>{origin}</span>
              ))}
            </div>

            <div className="foodTags">
              {food.tags && (
                <Tags
                  tags={food.tags.map(tag => ({ name: tag }))}
                  forFoodPage={true}
                />
              )}
            </div>

            <div className="foodCook_time">
              <span>
                Time to cook about <strong>{food.cookTime}</strong> minutes
              </span>
            </div>

            <div className="foodPrice">
              <Price price={food.price} />
            </div>

            <button onClick={handleAddToCart}>Add To Cart</button>
          </div>
        </div>
      )}
    </>
  )
};

export default FoodPage;
