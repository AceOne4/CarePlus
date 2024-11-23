import React, { useEffect, useState } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import Link from "next/link";
import "../../app/Payment.css";
const SuccessIcon = (
  <svg
    width="16"
    height="14"
    viewBox="0 0 16 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.4695 0.232963C15.8241 0.561287 15.8454 1.1149 15.5171 1.46949L6.14206 11.5945C5.97228 11.7778 5.73221 11.8799 5.48237 11.8748C5.23253 11.8698 4.99677 11.7582 4.83452 11.5681L0.459523 6.44311C0.145767 6.07557 0.18937 5.52327 0.556912 5.20951C0.924454 4.89575 1.47676 4.93936 1.79051 5.3069L5.52658 9.68343L14.233 0.280522C14.5613 -0.0740672 15.1149 -0.0953599 15.4695 0.232963Z"
      fill="white"
    />
  </svg>
);

const ErrorIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.25628 1.25628C1.59799 0.914573 2.15201 0.914573 2.49372 1.25628L8 6.76256L13.5063 1.25628C13.848 0.914573 14.402 0.914573 14.7437 1.25628C15.0854 1.59799 15.0854 2.15201 14.7437 2.49372L9.23744 8L14.7437 13.5063C15.0854 13.848 15.0854 14.402 14.7437 14.7437C14.402 15.0854 13.848 15.0854 13.5063 14.7437L8 9.23744L2.49372 14.7437C2.15201 15.0854 1.59799 15.0854 1.25628 14.7437C0.914573 14.402 0.914573 13.848 1.25628 13.5063L6.76256 8L1.25628 2.49372C0.914573 2.15201 0.914573 1.59799 1.25628 1.25628Z"
      fill="white"
    />
  </svg>
);

const InfoIcon = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 1.5H4C2.61929 1.5 1.5 2.61929 1.5 4V10C1.5 11.3807 2.61929 12.5 4 12.5H10C11.3807 12.5 12.5 11.3807 12.5 10V4C12.5 2.61929 11.3807 1.5 10 1.5ZM4 0C1.79086 0 0 1.79086 0 4V10C0 12.2091 1.79086 14 4 14H10C12.2091 14 14 12.2091 14 10V4C14 1.79086 12.2091 0 10 0H4Z"
      fill="white"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.25 7C5.25 6.58579 5.58579 6.25 6 6.25H7.25C7.66421 6.25 8 6.58579 8 7V10.5C8 10.9142 7.66421 11.25 7.25 11.25C6.83579 11.25 6.5 10.9142 6.5 10.5V7.75H6C5.58579 7.75 5.25 7.41421 5.25 7Z"
      fill="white"
    />
    <path
      d="M5.75 4C5.75 3.31075 6.31075 2.75 7 2.75C7.68925 2.75 8.25 3.31075 8.25 4C8.25 4.68925 7.68925 5.25 7 5.25C6.31075 5.25 5.75 4.68925 5.75 4Z"
      fill="white"
    />
  </svg>
);

interface StatusContent {
  text: string;
  iconColor: string;
  icon: JSX.Element;
}

const STATUS_CONTENT_MAP: Record<string, StatusContent> = {
  succeeded: {
    text: "Payment succeeded",
    iconColor: "#30B130",
    icon: SuccessIcon,
  },
  processing: {
    text: "Your payment is processing.",
    iconColor: "#6D6E78",
    icon: InfoIcon,
  },
  requires_payment_method: {
    text: "Your payment was not successful, please try again.",
    iconColor: "#DF1B41",
    icon: ErrorIcon,
  },
  default: {
    text: "Something went wrong, please try again.",
    iconColor: "#DF1B41",
    icon: ErrorIcon,
  },
};

export default function CompletePage(): JSX.Element {
  const stripe = useStripe();
  const [status, setStatus] = useState<string>("default");
  const [intentId, setIntentId] = useState<string | null>(null);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (!paymentIntent) {
        return;
      }

      setStatus(paymentIntent.status);
      setIntentId(paymentIntent.id);
    });
  }, [stripe]);

  const currentStatus =
    STATUS_CONTENT_MAP[status] || STATUS_CONTENT_MAP.default;

  return (
    <div id="payment-status">
      <div
        id="status-icon"
        style={{ backgroundColor: currentStatus.iconColor }}
      >
        {currentStatus.icon}
      </div>
      <h2 id="status-text">{currentStatus.text}</h2>
      {intentId && (
        <div id="details-table">
          <table>
            <tbody>
              <tr>
                <td className="TableLabel">id</td>
                <td id="intent-id" className="TableContent">
                  {intentId}
                </td>
              </tr>
              <tr>
                <td className="TableLabel">status</td>
                <td id="intent-status" className="TableContent">
                  {status}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {intentId && (
        <Link
          href={`https://dashboard.stripe.com/payments/${intentId}`}
          id="view-details"
          target="_blank"
          rel="noreferrer"
        >
          View details
          <svg
            width="15"
            height="14"
            viewBox="0 0 15 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ paddingLeft: "5px" }}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.125 3.49998C2.64175 3.49998 2.25 3.89173 2.25 4.37498V11.375C2.25 11.8582 2.64175 12.25 3.125 12.25H10.125C10.6082 12.25 11 11.8582 11 11.375V8.99998C11 8.58577 11.3358 8.24998 11.75 8.24998C12.1642 8.24998 12.5 8.58577 12.5 8.99998V11.375C12.5 12.6777 11.4277 13.75 10.125 13.75H3.125C1.82225 13.75 0.75 12.6777 0.75 11.375V4.37498C0.75 3.07223 1.82225 2 3.125 2H5.5C5.91421 2 6.25 2.33577 6.25 2.74998C6.25 3.16419 5.91421 3.49998 5.5 3.49998H3.125ZM8.125 0.499984C8.125 0.0857701 8.46079 -0.249984 8.875 -0.249984H14.125C14.5392 -0.249984 14.875 0.0857701 14.875 0.499984V5.74998C14.875 6.16419 14.5392 6.49998 14.125 6.49998C13.7108 6.49998 13.375 6.16419 13.375 5.74998V2.35348L8.18788 7.54061C7.89688 7.83161 7.42312 7.83161 7.13212 7.54061C6.84112 7.24961 6.84112 6.77584 7.13212 6.48484L12.3192 1.29772H8.875C8.46079 1.29772 8.125 0.962934 8.125 0.547723C8.125 0.547723 8.125 0.499984 8.125 0.499984Z"
              fill="#828489"
            />
          </svg>
        </Link>
      )}
    </div>
  );
}
