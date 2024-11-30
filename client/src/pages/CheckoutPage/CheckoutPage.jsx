import React, { useState, useEffect } from "react";
import { useCart } from "../../hooks/usecart";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import NavBar from "../../components/NavBar/NavBar.jsx";
import Title from "../../components/Title/Title";
import OrderItemsList from "../../components/OrderItemsList/OrderItemsList";
import { loadStripe } from "@stripe/stripe-js";
import "./CheckoutPage.css";

const stripePromise = loadStripe("pk_test_51PXdbsKsLOwdkUkUL1e78Ki8NUsVxOat3zMA6SYNejFFPbJ7qHTKJzve2NeZBkrp32MydGnzbJrWHclsOCnUtivt00xfBi2Jgh");

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { selectedRestaurantId } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState({ ...cart });
  const [tableNumber, setTableNumber] = useState("");
  const [description, setDescription] = useState("");
  const [promotion, setPromotion] = useState(null);
  const [discountedTotal, setDiscountedTotal] = useState(cart.totalPrice);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const promotionId = params.get("promotionId");
    if (promotionId) {
      axios.get(`/api/restaurants/${selectedRestaurantId}/promotions/${promotionId}`)
        .then(response => {
          setPromotion(response.data);
        })
        .catch(error => {
          console.error("Error fetching promotion:", error);
        });
    }
  }, [location]);

  useEffect(() => {
    if (promotion) {
      const applyDiscount = (item) => {
        const discount = (item.price * promotion.discountPercentage) / 100;
        return item.price - discount;
      };

      const updatedOrder = {
        ...order,
        items: order.items.map(item => ({
          ...item,
          discountedPrice: applyDiscount(item),
        })),
      };

      setOrder(updatedOrder);
      const totalDiscount = updatedOrder.items.reduce((acc, item) => acc + (item.price - item.discountedPrice), 0);
      setDiscountedTotal(cart.totalPrice - totalDiscount);
    } else {
      setOrder({ ...cart });
      setDiscountedTotal(cart.totalPrice);
    }
  }, [promotion, cart.totalPrice]);

  const createOrder = async () => {
    const orderItems = order.items.map(item => ({
      food: item.food,
      price: item.discountedPrice || item.price, // Use discountedPrice if available
      quantity: item.quantity,
    }));
    const orderDetails = {
      userId: user.id,
      items: orderItems,
      description,
      tableNumber,
      totalCount: cart.totalCount,
      totalPrice: discountedTotal,
    };

    const response = await axios.post(`/api/restaurants/${selectedRestaurantId}/order`, orderDetails);
    clearCart();
    const { orderId } = response.data;
    console.log("Order created successfully");
    return orderId;
  };

  const makePayment = async (orderId) => {
    const stripe = await stripePromise;

    const header = {
      "Content-Type": "application/json",
    };
    const response = await fetch(`https://digimenu-1.onrender.com/api/payment/create-checkout-session`, {
      method: "POST",
      headers: header,
      body: JSON.stringify({
        orderItems: order.items.map(item => ({
          food: item.food,
          price: item.discountedPrice || item.price, 
          quantity: item.quantity,
        })),
        selectedRestaurantId,
        orderId,
        totalPrice: discountedTotal,
      }),
    });
    const session = await response.json();
    const result = stripe.redirectToCheckout({
      sessionId: session.id,
    });
    if (result.error) console.log(result.error);
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const orderId = await createOrder();
      await makePayment(orderId);
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Checkout failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="checkoutContent">
        <Title title="Order Form" fontSize="1.6rem" />
        <div className="checkoutInputs">
          <label>
            Table Number:
            <input
              type="text"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
            />
          </label>
          <label>
            Description:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
        </div>
        <OrderItemsList order={order} discountedTotal={discountedTotal} /> {/* Pass discountedTotal as prop */}
        <div className="checkout_buttons_container">
          <div className="checkoutButtons">
            <button onClick={handleCheckout} disabled={isLoading}>
              {isLoading ? "Processing..." : "Go To Payment"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;