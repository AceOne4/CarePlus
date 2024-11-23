"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { Dispatch, SetStateAction, useState } from "react";
import { getAppointmentSchema } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import {
  createAppointment,
  updateAppointment,
} from "@/lib/actions/appointment.action";
import { Appointment } from "../../../types/appwrite.types";

function AppointmentForm({
  type,
  userid,
  patientid,
  appointment,
  setOpen,
  doctor,
}: {
  userid: string;
  patientid: string;
  type: "create" | "cancel" | "schedule";
  doctor: doctors[];
  appointment?: Appointment;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const [isloading, setIsloaing] = useState(false);

  // 1. Define your form.
  const appointmentValidation = getAppointmentSchema(type);
  const form = useForm<z.infer<typeof appointmentValidation>>({
    resolver: zodResolver(appointmentValidation),
    defaultValues: {
      doctor: (appointment?.doctor as unknown as doctors)?.$id || "",
      reason: appointment?.reason || "",
      note: appointment?.note || "",
      schedule: appointment
        ? new Date(appointment?.schedule!)
        : new Date(Date.now()),
      cancellationReason: appointment?.cancellationReason || "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof appointmentValidation>) {
    setIsloaing(true);
    let status;
    switch (type) {
      case "schedule":
        status = "scheduled";
        break;
      case "cancel":
        status = "cancelled";
        break;
      default:
        status = "pending";
        break;
    }

    try {
      if (type == "create" && patientid) {
        const appointmentData = {
          userId: userid,
          patient: patientid,
          doctor: values.doctor,
          reason: values.reason!,
          note: values.note,
          schedule: new Date(values.schedule),
          cancellationReason: values.cancellationReason,
          status: status as Status,
        };
        const appointment = await createAppointment(appointmentData);
        if (appointment) {
          form.reset();
          router.push(
            `/patients/${userid}/new-appointment/success?appointmentId=${appointment.$id}`
          );
        }
      } else {
        const appointmentToUpdate = {
          userId: userid,
          appointmentId: appointment?.$id!,
          appointment: {
            doctor: values.doctor,
            schedule: new Date(values.schedule),
            status: status as Status,
            cancellationReason: values.cancellationReason,
          },
          type,
        };
        //ts@ignore
        const updatedAppointment = await updateAppointment(appointmentToUpdate);

        if (updatedAppointment) {
          setOpen && setOpen(false);
          form.reset();
        }
      }
    } catch (error) {
      console.log(error);
    }
    setIsloaing(false);
  }
  let buttonLabel;
  switch (type) {
    case "cancel":
      buttonLabel = "Cancel Appointment";
      break;
    case "create":
      buttonLabel = "Create Appointment";
      break;
    case "schedule":
      buttonLabel = "Schedule Appointment";
      break;
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        {type === "create" && (
          <section className="mb-12 space-y-4">
            <h1 className="header">Hey There 👋</h1>
            <p className="text-dark-700">
              Request and new appointment in 10 seconds.
            </p>
          </section>
        )}
        {type !== "cancel" && (
          <>
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="doctor"
              label="Doctor"
              placeholder="Select Doctor"
            >
              {doctor.map((doc) => (
                <SelectItem key={doc.$id} value={doc.$id}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={doc.image || ""}
                      width={32}
                      height={32}
                      alt={doc.name}
                      className=" rounded-full border border-dark-500"
                    />
                    <p>{doc.name}</p>
                    <span className="text-xs text-dark-700">
                      {doc.specialization}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>

            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Reason For Appointment"
                placeholder="Enter reason for appointment"
              />
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Additional Comments/Notes"
                placeholder="Enter Comments or notes"
              />
            </div>

            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Expected appointment date"
              showTimeSelect
              dateFormat="mm/dd/yyyy - h:mm aa"
            />
          </>
        )}
        {type === "cancel" && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="Enter reason for cancellation"
          />
        )}

        <SubmitButton
          isLoading={isloading}
          className={`${
            type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"
          } w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
}

export default AppointmentForm;
