"use client";
import React, { useState, useEffect } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CompletePage from "@/components/payment/CompletePage";
import CheckoutForm from "@/components/payment/CheckOutForm";
import "../Payment.css";
import { getAppointment } from "@/lib/actions/appointment.action";
import Link from "next/link";
import { decode, encode } from "@/lib/utils";
import Spinner from "@/components/Spinner";
// Load Stripe outside of the component's render to prevent recreation.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

export default function App() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [dpmCheckerLink, setDpmCheckerLink] = useState<string>("");
  const [fees, setFees] = useState(0);
  const [encodedFees, setEncodedFees] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const amount = new URLSearchParams(window.location.search).get("fees");
    if (amount) {
      const appointmentFees = async () => {
        try {
          setLoading(true);
          const appointment = await getAppointment(amount as string);
          const charges = Math.round(appointment.doctor.charges * 1.14);
          const encodedcharges = encode(charges);
          setFees(charges);
          setEncodedFees(encodedcharges);
        } catch (error) {
          console.log(error);
        }
      };
      appointmentFees();
    }
  }, []);

  useEffect(() => {
    // Create PaymentIntent when the page loads
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item: fees }),
    })
      .then((res) => res.json())
      .then((data: { clientSecret: string; dpmCheckerLink: string }) => {
        setClientSecret(data.clientSecret);
        setDpmCheckerLink(data.dpmCheckerLink);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching payment intent:", error);
      });
  }, []);

  const appearance: StripeElementsOptions["appearance"] = {
    theme: "stripe",
  };

  const options: StripeElementsOptions = {
    clientSecret: clientSecret || "",
    appearance,
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center w-screen h-screen">
        {loading ? (
          <Spinner />
        ) : (
          <>
            {fees < 0 ? (
              <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-700 mb-4">
                    Please book an appointment first.
                  </p>
                  <Link
                    href="/"
                    className="bg-green-500 text-white font-medium text-lg py-3 px-6 rounded-md shadow-md transform transition-transform duration-300 hover:scale-110 hover:bg-green-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                  >
                    Book Appointment Here
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-center items-center mt-20 py-5 px-5 bg-green-700 rounded-lg shadow-lg text-white text-lg">
                  <p>
                    Your appointment fee is{" "}
                    <span className="font-bold text-yellow-300">${fees}</span>
                    Please complete the payment to confirm your booking.
                  </p>
                </div>

                {clientSecret && stripePromise && (
                  <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm
                      dpmCheckerLink={dpmCheckerLink}
                      encodedfees={encodedFees}
                    />
                  </Elements>
                )}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
