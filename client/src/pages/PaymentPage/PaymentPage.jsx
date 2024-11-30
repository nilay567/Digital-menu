import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import OrderItemsList from "../../components/OrderItemsList/OrderItemsList";
import Title from "../../components/Title/Title";
import { useAuth } from "../../hooks/useAuth";
import "./PaymentPage.css";

const stripePromise = loadStripe("pk_test_51PXdbsKsLOwdkUkUL1e78Ki8NUsVxOat3zMA6SYNejFFPbJ7qHTKJzve2NeZBkrp32MydGnzbJrWHclsOCnUtivt00xfBi2Jgh");

const PaymentPage = () => {
  const { selectedRestaurantId, orderId } = useParams();
  const [order, setOrder] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `/api/restaurants/${selectedRestaurantId}/order/${orderId}`
        );
        setOrder(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [selectedRestaurantId, orderId]);

  const makePayment = async () => {
    const stripe = await stripePromise;

    const body = {
      products: order.items,
    };

    try {
      const response = await axios.post(
        "api/restaurants/create-checkout-session",
        body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const session = response.data;

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.log(result.error.message);
      }
    } catch (error) {
      console.error("Error in making payment:", error);
    }
  };

  if (!order) return <div>Loading...</div>;

  return (
    <div className="paymentContainer">
      <div className="paymentContent">
        <Title title="Order Form" fontSize="1.6rem" />
        <div className="paymentSummary">
          <div className="summaryItem">
            <h3>Name:</h3>
            <span>{user.name}</span>
          </div>
          <div className="summaryItem">
            <h3>Table No. :</h3>
            <span>{order.tableNumber}</span>
          </div>
        </div>
        <OrderItemsList order={order} />
      </div>
      <button className="paymentButton" onClick={makePayment}>Pay</button>
    </div>
  );
};

export default PaymentPage;














// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
// import { toast } from "react-toastify";
// import axios from "axios";
// import Title from "../../components/Title/Title";
// import Button from "../../components/Button/Button";
// import "./PaymentPage.css";

// const PaymentPage = () => {
//   const { selectedRestaurantId, orderId } = useParams();
//   const stripe = useStripe();
//   const elements = useElements();
//   const navigate = useNavigate();
//   const [clientSecret, setClientSecret] = useState("");

//   useEffect(() => {
//     const createPaymentIntent = async () => {
//       try {
//         const response = await axios.post("/api/restaurants/create-payment-intent", { orderId, selectedRestaurantId });
//         setClientSecret(response.data.clientSecret);
//       } catch (error) {
//         console.error("Error creating payment intent:", error);
//         toast.error("Failed to initialize payment");
//       }
//     };

//     createPaymentIntent();
//   }, [orderId]);

//   const handlePaymentSubmit = async (event) => {
//     event.preventDefault();

//     if (!stripe || !elements) {
//       return;
//     }

//     const cardElement = elements.getElement(CardElement);
//     const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
//       payment_method: {
//         card: cardElement,
//       },
//     });

//     if (error) {
//       console.error("Error confirming card payment:", error);
//       toast.error(error.message);
//     } else if (paymentIntent.status === "succeeded") {
//       try {
//         await axios.post(`/api/restaurants/${selectedRestaurantId}/order/${orderId}/payment-success`);
//         toast.success("Payment successful!");
//         navigate("/orders");
//       } catch (error) {
//         console.error("Error updating payment status:", error);
//         toast.error("Payment was successful, but updating order status failed");
//       }
//     }
//   };

//   return (
//     <div className="payment-page">
//       <Title title="Complete Your Payment" fontSize="1.6rem" />
//       <form onSubmit={handlePaymentSubmit}>
//         <CardElement />
//         <Button type="submit" disabled={!stripe}>
//           Pay Now
//         </Button>
//       </form>
//     </div>
//   );
// };

// export default PaymentPage;



