import React from "react";
import "./Thumbnails.css";
import { Link } from "react-router-dom";
import StarRating from "../StarRating/StarRating.jsx";
import Price from "../Price/Price.jsx";

const Thumbnails = ({ foods }) => {
  return (
    <ul className={"list"}>
      {foods.map((food) => (
        <li key={food.id}>
          <Link to={`/food/${food.id}`}>
            <img
              className="image"
              src={`${food.imageUrl}`}
              alt={food.name}
            />

            <div className="content">
              <div className="name">{food.name}</div>
              <span
                className={`${"favorite"} ${
                  food.favorite ? "" : "not"
                }`}
              >
                ❤
              </span>
              <div className="stars">
                <StarRating stars={food.stars} />
              </div>
              <div className="product_item_footer">
                <div className="origins">
                  {food.origins.map((origin) => (
                    <span key={origin}>{origin}</span>
                  ))}
                </div>
                <div className="cook_time">
                  <span>🕒</span>
                  {food.cookTime}
                </div>
              </div>
              <div className="price">
                <Price price={food.price} />
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Thumbnails;
