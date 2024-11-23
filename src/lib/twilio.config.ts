import twilio from "twilio";

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } =
  process.env;

if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
  throw new Error("Twilio configuration variables are missing.");
}

// Initialize Twilio client
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Function to send an SMS
export const sendSMS = async (to: string, message: string) => {
  try {
    console.log(to);

    const result = await client.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER, // Your Twilio phone number
      to: to, // Recipient phone number
    });
    console.log("Message sent successfully:", result.sid);
    return result;
  } catch (error: any) {
    console.error("Failed to send SMS:", error.message, error.code);
    throw new Error(`Failed to send SMS: ${error.message}`);
  }
};
