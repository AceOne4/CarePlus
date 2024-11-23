"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import "react-datepicker/dist/react-datepicker.css";
import { Appointment } from "../../types/appwrite.types";
import AppointmentForm from "./forms/AppointmentForm";
import { getDoctors } from "@/lib/actions/doctor.action";
import { Doctors } from "../../constants";

export const AppointmentModal = ({
  patientId,
  userId,
  appointment,
  type,
}: {
  patientId: string;
  userId: string;
  appointment?: Appointment;
  type: "schedule" | "cancel";
  title: string;
  description: string;
}) => {
  const [open, setOpen] = useState(false);

  const newtype = type === "schedule" && "scheduled";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={
            appointment?.status === "cancelled" ||
            appointment?.status === newtype
          }
          variant="ghost"
          className={`capitalize ${
            type === "schedule" ? "text-green-500" : "text-red-700"
          }`}
        >
          {type}
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog sm:max-w-md">
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle className="capitalize">{type} Appointment</DialogTitle>
          <DialogDescription>
            Please fill in the following details to {type} appointment
          </DialogDescription>
        </DialogHeader>

        <AppointmentForm
          doctor={Doctors}
          userid={userId}
          patientid={patientId}
          type={type}
          appointment={appointment}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
};
