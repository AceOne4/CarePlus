import * as sdk from "node-appwrite";

export const {
  PROJECT_ID,
  API_KEY,
  DB_ID,
  PATIENT_COLLECTION_ID,
  DOCTOR_COLLECTION_ID,
  APPOINTMENT_COLLECTION_ID,
  NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
  NEXT_PUBLIC_ENDPOINT: ENDPOINT,
} = process.env;

const client = new sdk.Client();

// Validate environment variables to prevent runtime issues
if (!ENDPOINT || !PROJECT_ID || !API_KEY) {
  throw new Error(
    "Environment variables for Appwrite configuration are missing."
  );
}

client.setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
export const DB = new sdk.Databases(client);
export const storage = new sdk.Storage(client);
export const account = new sdk.Account(client);
export const users = new sdk.Users(client);
