"use client";
import { MdCheckCircle } from "react-icons/md";
import Link from "next/link";
import { useEffect, useState } from "react";
import { decode } from "@/lib/utils";
import Spinner from "@/components/Spinner";

const PaymentSuccess = () => {
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    // Access the search params directly from the window.location object
    const params = new URLSearchParams(window.location.search);
    const amountFromParams = params.get("amount");
    if (amountFromParams) {
      const amount = decode(amountFromParams);
      setAmount(amount);
    }

    setLoading(false);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <div className="text-center p-6 border border-green-900  rounded shadow-md shadow-green-300 ">
        {loading ? (
          <Spinner />
        ) : (
          <>
            <MdCheckCircle className="text-green-500 text-6xl mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Payment Successful!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Thank you for your payment of
              <span className="font-bold text-gray-800 dark:text-gray-200">
                {" "}
                ${amount}
              </span>
              . Your transaction has been completed successfully.
            </p>
            <Link
              href="/"
              className="bg-green-500 text-white font-medium py-2 px-6 rounded-md shadow-md transform transition-transform duration-300 hover:scale-105 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
            >
              Go to Home
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
