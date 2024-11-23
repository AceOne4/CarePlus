import React, { useState, FormEvent } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { StripePaymentElementOptions } from "@stripe/stripe-js";
import "../../app/Payment.css";
interface CheckoutFormProps {
  dpmCheckerLink: string;
  encodedfees: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  dpmCheckerLink,
  encodedfees,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Replace with your payment completion page URL
        return_url: `http://localhost:3000/payment/success?amount=${encodedfees}`,
      },
    });

    // Handle errors during payment confirmation
    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message || "An error occurred.");
      } else {
        setMessage("An unexpected error occurred.");
      }
    } else {
      setMessage(null);
    }

    setIsLoading(false);
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: "tabs",
  };

  return (
    <>
      <form id="payment-form " className="bg-green-300" onSubmit={handleSubmit}>
        <PaymentElement
          id="payment-element"
          options={paymentElementOptions || ""}
        />
        <button
          className="bg-green-700"
          disabled={isLoading || !stripe || !elements}
          id="submit"
          type="submit"
        >
          <span id="button-text">
            {isLoading ? (
              <div className="spinner" id="spinner"></div>
            ) : (
              "Pay now"
            )}
          </span>
        </button>
        {/* Display any error or success messages */}
        {message && <div id="payment-message">{message}</div>}
      </form>
    </>
  );
};

export default CheckoutForm;
