import LoginForm from "@/components/forms/LoginForm";
import Image from "next/image";
import React from "react";

function page() {
  return (
    <div className="h-screen max-h-screen flex">
      <section className=" remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />
          <LoginForm />
          <div className="text-14-regular mt-20 flex justify-between">
            <p className=" justify-items-end text-dark-600 lg:text-left">
              © 2024 CarePlus
            </p>
          </div>
        </div>
      </section>
      <Image
        src="/assets/images/login.jpg"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[50%]"
      />
    </div>
  );
}

export default page;
