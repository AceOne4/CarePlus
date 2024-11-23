"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { LoginFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { loginAction } from "@/lib/actions/patient.action";
function LoginForm() {
  const router = useRouter();
  const [isloading, setIsloaing] = useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof LoginFormValidation>>({
    resolver: zodResolver(LoginFormValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit({
    email,
    password,
  }: z.infer<typeof LoginFormValidation>) {
    setIsloaing(true);

    try {
      await loginAction(email, password);
    } catch (error) {
      console.log(error);
    }
    setIsloaing(false);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">Welcome back 👋</h1>
          <p className="text-dark-700">Login to your account</p>
        </section>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Email"
          placeholder="johndoe@gmail.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="password"
          label="Password"
          placeholder="Enter Your Password"
          type="password"
        />
        <SubmitButton isLoading={isloading}>login</SubmitButton>
      </form>
    </Form>
  );
}

export default LoginForm;
