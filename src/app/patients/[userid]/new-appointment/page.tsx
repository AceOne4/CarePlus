import AppointmentForm from "@/components/forms/AppointmentForm";
import { getDoctors } from "@/lib/actions/doctor.action";
import { getPatient } from "@/lib/actions/patient.action";
import Image from "next/image";
import React from "react";

async function Appoinment({ params }: { params: { userid: string } }) {
  const { userid } = await params;
  const patient = await getPatient(userid);
  const doctor = await getDoctors();
  return (
    <div className="h-screen max-h-screen flex">
      <section className=" remove-scrollbar container ">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />
          <AppointmentForm
            type="create"
            userid={userid}
            patientid={patient.$id}
            doctor={doctor}
          />
          <p className=" copyright py-12">© 2024 CarePlus</p>
        </div>
      </section>
      <Image
        src="/assets/images/appointment-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[390px]"
      />
    </div>
  );
}

export default Appoinment;
