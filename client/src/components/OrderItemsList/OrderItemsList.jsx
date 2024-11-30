import React from "react";
import PropTypes from "prop-types";
import "./OrderItemsList.css";

const OrderItemsList = ({ order, discountedTotal }) => {
  return (
    <div className="orderItemsList">
      <h2>Order Items</h2>
      {order.items && order.items.length > 0 ? (
        <ul>
          {order.items.map((item, index) => (
            <li key={index} className="orderItem">
              <span className="itemName">{item.food}</span>
              <span className="itemQuantity">x{item.quantity}</span>
              <span className="itemPrice">
                ₹{(item.discountedPrice || item.price).toFixed(2)} {/* Use discountedPrice if available */}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No items in the order.</p>
      )}
      <div className="orderSummary">
        <p>Total Items: {order.totalCount}</p>
        <p>Total Price: ₹{order.totalPrice.toFixed(2)}</p>
        <p>Discounted Total Price: ₹{discountedTotal.toFixed(2)}</p> {/* Display discounted total price */}
      </div>
    </div>
  );
};

OrderItemsList.propTypes = {
  order: PropTypes.shape({
    items: PropTypes.arrayOf(
      PropTypes.shape({
        food: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        discountedPrice: PropTypes.number, // Add this line
        quantity: PropTypes.number.isRequired,
      })
    ).isRequired,
    totalCount: PropTypes.number.isRequired,
    totalPrice: PropTypes.number.isRequired,
  }).isRequired,
  discountedTotal: PropTypes.number.isRequired, // Add prop type for discountedTotal
};

export default OrderItemsList;
