"use client";
import React, { useState } from "react";
import { Appointment } from "../../types/appwrite.types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { formatDateTime } from "@/lib/utils";

function AppointmentStatusModal({
  type,
  appointment,
}: {
  type: string;
  appointment: Appointment;
}) {
  const [open, setOpen] = useState(false);

  const statusClasses = {
    cancelled: "text-red-500",
    pending: "text-blue-500",
    scheduled: "text-green-500",
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="capitalize text-yellow-500">
          {type}
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog sm:max-w-md">
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle className="capitalize">{type} Appointment</DialogTitle>
          <DialogDescription>Your Appiotment Details</DialogDescription>
        </DialogHeader>
        <div className="">
          <p className="text-white">
            <span className="font-bold text-white mr-2">Doctor:</span>
            {(appointment.doctor as unknown as doctors).name}
          </p>
          <p className="text-white">
            <span className="font-bold text-white mr-2">Reason:</span>{" "}
            {appointment.reason}
          </p>
          <p className="text-white">
            <span className="font-bold text-white mr-2">Schedule:</span>
            {formatDateTime(appointment.schedule).dateTime}
          </p>
          <p className={statusClasses[appointment.status] || "text-gray-500"}>
            <span className="font-bold text-white mr-2">Status:</span>
            {appointment.status}
          </p>
          {appointment.note && (
            <p className="text-white">
              <span className="font-bold text-white mr-2">Notes:</span>{" "}
              {appointment.note}
            </p>
          )}
          {appointment.status === "cancelled" && (
            <p className="text-red-500 ">
              <span className="font-bold text-white mr-2">Cancelled:</span>{" "}
              {appointment.cancellationReason || "No reason provided"}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AppointmentStatusModal;
