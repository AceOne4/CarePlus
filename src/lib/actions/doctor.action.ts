import { Query } from "node-appwrite";
import { DB, DB_ID, DOCTOR_COLLECTION_ID } from "../appwrite.config";
import { parseStringify } from "../utils";

export const getDoctors = async () => {
  try {
    const doctors = await DB.listDocuments(DB_ID!, DOCTOR_COLLECTION_ID!);
    return parseStringify(doctors.documents);
  } catch (err) {
    console.log(err);
  }
};

export const getADoctor = async (doctoId: string) => {
  try {
    const doctor = await DB.getDocument(DB_ID!, DOCTOR_COLLECTION_ID!, doctoId);

    return parseStringify(doctor);
  } catch (error) {
    console.log(error);
  }
};
