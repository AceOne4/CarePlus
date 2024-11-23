import LogoutButton from "@/components/LogoutButton";
import StatCard from "@/components/StatCard";
import SubmitButton from "@/components/SubmitButton";
import { columns } from "@/components/table/Columns";
import { DataTable } from "@/components/table/DataTable";
import { patientColumn } from "@/components/table/patientColumn";
import { Button } from "@/components/ui/button";
import { getAppointmentByUserId } from "@/lib/actions/appointment.action";
import { getPatientbyEmail, signOutAction } from "@/lib/actions/patient.action";
import { auth } from "@/lib/auth";
import { useUserStore } from "@/lib/store/userStore";
import Image from "next/image";
import Link from "next/link";
import React from "react";

async function page() {
  const session = await auth();
  if (!session) return;
  const patient = await getPatientbyEmail(session.user?.email as string);
  const appointments = await getAppointmentByUserId(patient.userId);

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header">
        <Link href="/" className="cursor-pointer">
          <Image
            src="/assets/icons/logo-full.svg"
            height={162}
            width={32}
            alt="logo"
            className=" h-8 w-fit"
          />
        </Link>

        <Link
          href={`/patients/${patient.userId}/new-appointment`}
          className="text-sm font-semibold py-2 px-2  hover:scale-105"
        >
          Book an appointment
        </Link>
        <LogoutButton />
      </header>
      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">
            Welcome
            <span className="font-semibold text-lg ml-2">
              {session.user?.name}
            </span>
          </h1>
          <p className="text-dark-700">
            Stay on top of your upcoming and past appointments effortlessly.
          </p>
        </section>
        <section className="admin-stat">
          <StatCard
            type="appointments"
            count={appointments.scheduledCount}
            label="Scheduled appointments"
            icon={"/assets/icons/appointments.svg"}
          />
          <StatCard
            type="pending"
            count={appointments.pendingCount}
            label="Pending appointments"
            icon={"/assets/icons/pending.svg"}
          />
          <StatCard
            type="cancelled"
            count={appointments.cancelledCount}
            label="Cancelled appointments"
            icon={"/assets/icons/cancelled.svg"}
          />
        </section>
        <DataTable columns={patientColumn} data={appointments.documents} />
      </main>
    </div>
  );
}

export default page;
