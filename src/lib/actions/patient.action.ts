"use server";
import { ID, Query, InputFile } from "node-appwrite";
import {
  BUCKET_ID,
  DB_ID,
  ENDPOINT,
  PATIENT_COLLECTION_ID,
  PROJECT_ID,
  DB,
  storage,
  users,
} from "../appwrite.config";
import { generateSecurePassword, parseStringify } from "../utils";
import { sendSMS } from "../twilio.config";
import { sendEmail } from "../nodmailer.config";
import { auth, signIn, signOut } from "../auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifyPassword } from "../lib";

export const createUser = async (user: CreateUserParams) => {
  try {
    const pass = generateSecurePassword();

    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone || undefined, // Pass undefined only if phone is not provided
      pass, // Assuming password is not required
      user.name
    );
    // Prepare message
    const message = `
  Hello! This is CarePlus. 
  Your temporary password is: ${pass}.
  Please use it to log in to your account. 
  We look forward to seeing you soon and wish you the best of health!
`;

    // Send notifications
    if (user.phone) await sendSMS(user.phone, message);
    if (user.email)
      await sendEmail(user.email, "Your CarePlus Password", message);
    return newUser;
  } catch (error: any) {
    if (error?.code === 409) {
      // 409 indicates a conflict, likely due to duplicate email
      console.log("User already exists, fetching existing user.");

      const existingUsers = await users.list([
        Query.equal("email", [user.email]),
      ]);
      return existingUsers?.users[0];
    } else {
      console.error("Error creating user:", error);
      throw error; // Rethrow error to handle it further up the chain if necessary
    }
  }
};

export const getUser = async (userid: string) => {
  try {
    const user = await users.get(userid);

    return parseStringify(user);
  } catch (error) {
    console.log(error);
  }
};
export const getPatient = async (userid: string) => {
  try {
    const patients = await DB.listDocuments(DB_ID!, PATIENT_COLLECTION_ID!, [
      Query.equal("userId", userid),
    ]);

    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.log(error);
  }
};

export const getPatientbyEmail = async (email: string) => {
  try {
    const patients = await DB.listDocuments(DB_ID!, PATIENT_COLLECTION_ID!, [
      Query.equal("email", email),
    ]);

    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.log(error);
  }
};
export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    // Upload file ->  // https://appwrite.io/docs/references/cloud/client-web/storage#createFile
    let file;
    if (identificationDocument) {
      const inputFile =
        identificationDocument &&
        InputFile.fromBlob(
          identificationDocument?.get("blobFile") as Blob,
          identificationDocument?.get("fileName") as string
        );

      const enteredFile = await inputFile;

      file = await storage.createFile(BUCKET_ID!, ID.unique(), enteredFile);
    }

    // Create new patient document -> https://appwrite.io/docs/references/cloud/server-nodejs/DB#createDocument
    const newPatient = await DB.createDocument(
      DB_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id ? file.$id : null,
        identificationDocumentUrl: file?.$id
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view??project=${PROJECT_ID}`
          : null,
        ...patient,
      }
    );

    return parseStringify(newPatient);
  } catch (error) {
    console.error("An error occurred while creating a new patient:", error);
  }
};

export const getUSerLogin = async (email: string, password: string) => {
  try {
    const user = await users.list([Query.equal("email", email)]);
    if (user.total <= 0) throw new Error("invaled email");

    const verifypass = await verifyPassword(
      password,
      user.users[0].password as string
    );
    if (!verifypass) throw new Error("Invalid password");

    return user.users[0];
  } catch (error) {
    console.log(error);
  }
};

export async function loginAction(email: string, password: string) {
  await signIn("credentials", {
    email,
    password,
    redirectTo: "/dashboard",
  });
}

export async function signOutAction() {
  const session = await auth();
  if (!session) {
    throw new Error("User is not authenticated");
  }
  await signOut({ redirectTo: "/" });
  revalidatePath("/");
}
