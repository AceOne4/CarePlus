// Import the Stripe library
import Stripe from "stripe";
import { NextResponse } from "next/server";

// Initialize Stripe with the secret API key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// Function to calculate the order amount
const calculateOrderAmount = (item: number): number => {
  return item * 100 || 1400;
};

// Define the POST request handler
export async function POST(req: Request) {
  try {
    // Parse the request body
    const { item } = await req.json();

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(item),
      currency: "eur",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Respond with the PaymentIntent client secret and additional info
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      // DEV: For demo purposes, include a direct link for developers to check
      dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
    });
  } catch (error: any) {
    // Handle errors appropriately
    console.error("Error creating PaymentIntent:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
