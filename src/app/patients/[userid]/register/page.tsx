import RegisterForm from "@/components/forms/RegisterForm";
import { getDoctors } from "@/lib/actions/doctor.action";
import { getUser } from "@/lib/actions/patient.action";
import Image from "next/image";

import React from "react";

async function Register({ params }: { params: { userid: string } }) {
  const { userid } = await params;
  const user = await getUser(userid);
  const doctors = await getDoctors();
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
          <RegisterForm user={user} doctors={doctors} />
          <p className=" copyright py-12">© 2024 CarePlus</p>
        </div>
      </section>
      <Image
        src="/assets/images/register-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[390px]"
      />
    </div>
  );
}

export default Register;
