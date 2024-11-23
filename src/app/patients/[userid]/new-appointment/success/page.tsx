import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";
import { getAppointment } from "@/lib/actions/appointment.action";
import { getDoctors } from "@/lib/actions/doctor.action";

const RequestSuccess = async ({ searchParams, params }: SearchParamProps) => {
  const { userid } = await params;
  const { appointmentId } = await searchParams;
  const appointment = await getAppointment(appointmentId as string);
  const doctors = await getDoctors();

  const doctor = doctors.find(
    (doctor: doctors) => doctor.$id === appointment.doctor.$id
  );
  return (
    <div className=" flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <Link href="/">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="h-10 w-fit"
          />
        </Link>

        <section className="flex flex-col items-center">
          <Image
            src="/assets/gifs/success.gif"
            height={300}
            width={280}
            alt="success"
            unoptimized
          />
          <h2 className="header mb-6 max-w-[600px] text-center">
            Your <span className="text-green-500">appointment request</span> has
            been successfully submitted!
          </h2>
          <p>We&apos;ll be in touch shortly to confirm.</p>
        </section>

        <section className="request-details">
          <p>Requested appointment details: </p>
          <div className="flex items-center gap-3">
            <Image
              src={doctor?.image!}
              alt="doctor"
              width={100}
              height={100}
              className="size-6"
            />
            <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
          </div>
          <div className="flex gap-2">
            <Image
              src="/assets/icons/calendar.svg"
              height={24}
              width={24}
              alt="calendar"
            />
            <p> {formatDateTime(appointment.schedule).dateTime}</p>
          </div>
        </section>
        <div className="flex items-center justify-between gap-5">
          <Button variant="outline" className="shad-secondary-btn" asChild>
            <Link href={`/dashboard`}>Home</Link>
          </Button>
          <Button variant="outline" className="shad-primary-btn" asChild>
            <Link href={`/patients/${userid}/new-appointment`}>
              New Appointment
            </Link>
          </Button>

          <Button variant="outline" className="shad-ghost-btn" asChild>
            <Link href={`/payment?fees=${appointmentId}`}>Payment</Link>
          </Button>
        </div>
        <p className="copyright">© 2024 CarePluse</p>
      </div>
    </div>
  );
};

export default RequestSuccess;
