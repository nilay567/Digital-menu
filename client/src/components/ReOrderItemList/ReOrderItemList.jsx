import React from "react";
import PropTypes from "prop-types";
import "./ReOrderItemList.css";

const ReOrderItemList = ({ order }) => {
  return (
    <div className="reorder-item-list">
      <h2>Order Items</h2>
      <ul>
        {order.items.map((item, index) => (
          <li key={index} className="reorder-item">
            <span className="reorder-item-name">{item.food}</span>
            <span className="reorder-item-quantity">x{item.quantity}</span>
            <span className="reorder-item-price">${item.price.toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <div className="reorder-total">
        <span>Total Items: {order.totalCount}</span>
        <span>Total Price: ${order.totalPrice.toFixed(2)}</span>
      </div>
    </div>
  );
};

ReOrderItemList.propTypes = {
  order: PropTypes.shape({
    items: PropTypes.arrayOf(
      PropTypes.shape({
        food: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        quantity: PropTypes.number.isRequired,
      })
    ).isRequired,
    totalCount: PropTypes.number.isRequired,
    totalPrice: PropTypes.number.isRequired,
  }).isRequired,
};

export default ReOrderItemList;
