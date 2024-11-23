import PatientForm from "@/components/forms/PatientForm";
import PasskeyModal from "@/components/PassKeyModal";

import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function Home({ searchParams }: SearchParamProps) {
  const { admin } = await searchParams;
  const isAdmin = admin === "true";

  return (
    <div className="h-screen max-h-screen flex">
      {isAdmin && <PasskeyModal />}
      <section className=" remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />
          <PatientForm />
          <Link
            href="/login"
            className=" mt-2 text-center text-indigo-500 underline"
          >
            Login from here
          </Link>
          <div className="text-14-regular mt-20 flex justify-between">
            <p className=" justify-items-end text-dark-600 lg:text-left">
              © 2024 CarePlus
            </p>
            <Link href="/?admin=true" className="text-green-500">
              Admin
            </Link>
          </div>
        </div>
      </section>
      <Image
        src="/assets/images/onboarding-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[50%]"
      />
    </div>
  );
}
