"use server";

import { ID, Query } from "node-appwrite";
import { APPOINTMENT_COLLECTION_ID, DB, DB_ID } from "../appwrite.config";
import { parseStringify, formatDateTime } from "../utils";
import { Appointment } from "../../../types/appwrite.types";
import { revalidatePath } from "next/cache";
import { sendSMS } from "../twilio.config";
import { getUser } from "./patient.action";

export const createAppointment = async (
  appointment: CreateAppointmentParams
) => {
  try {
    const newAppointment = await DB.createDocument(
      DB_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      appointment
    );

    return parseStringify(newAppointment);
  } catch (error: any) {
    console.error("An error occurred while creating a new appointment:", error);
    console.error(
      "An error occurred while creating a new appointment:",
      error.response
    );
  }
};

export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await DB.getDocument(
      DB_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId
    );

    return parseStringify(appointment);
  } catch (error) {
    console.error("An error occurred while retrieving the appointment:", error);
  }
};

export const getAppointmentByUserId = async (userId: string) => {
  try {
    const appointments = await DB.listDocuments(
      DB_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.equal("userId", userId)]
    );

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = (appointments.documents as Appointment[]).reduce(
      (acc, appointment) => {
        switch (appointment.status) {
          case "scheduled":
            acc.scheduledCount++;
            break;
          case "pending":
            acc.pendingCount++;
            break;
          case "cancelled":
            acc.cancelledCount++;
            break;
        }
        return acc;
      },
      initialCounts
    );
    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    };

    return parseStringify(data);
  } catch (error) {
    console.error("An error occurred while retrieving the appointment:", error);
  }
};

export const getLatestAppointmentsList = async () => {
  try {
    const appointments = await DB.listDocuments(
      DB_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );
    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = (appointments.documents as Appointment[]).reduce(
      (acc, appointment) => {
        switch (appointment.status) {
          case "scheduled":
            acc.scheduledCount++;
            break;
          case "pending":
            acc.pendingCount++;
            break;
          case "cancelled":
            acc.cancelledCount++;
            break;
        }
        return acc;
      },
      initialCounts
    );
    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    };

    return parseStringify(data);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the recent appointments:",
      error
    );
  }
};

export const updateAppointment = async ({
  appointmentId,
  userId,
  appointment,
  type,
  timeZone,
}: UpdateAppointmentParams) => {
  try {
    // Update appointment to scheduled -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#updateDocument
    const updatedAppointments = await DB.updateDocument(
      DB_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    );

    if (!updatedAppointments) throw Error;

    // const smsMessage = `Greetings from CarePulse. ${
    //   type === "schedule"
    //     ? `Your appointment is confirmed for ${
    //         formatDateTime(appointment.schedule!).dateTime
    //       } with Dr. ${appointment.primaryPhysician}`
    //     : `We regret to inform that your appointment for ${
    //         formatDateTime(appointment.schedule!).dateTime
    //       } is cancelled. Reason:  ${appointment.cancellationReason}`
    // }.`;

    // const user = await getUser(userId);
    // const phoneNumber = user.phone;
    // await sendSMS(phoneNumber, smsMessage);
    console.log(type);

    revalidatePath("/admin");
    return parseStringify(updatedAppointments);
  } catch (error) {
    console.error("An error occurred while scheduling an appointment:", error);
  }
};
