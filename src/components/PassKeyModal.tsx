"use client";
import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { decryptKey, encryptKey } from "@/lib/utils";

function PasskeyModal() {
  const router = useRouter();
  const path = usePathname();
  const [open, setopen] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");

  const encryptedKey =
    typeof window !== "undefined"
      ? window.localStorage.getItem("accessKey")
      : null;

  useEffect(() => {
    const acccessKey = encryptedKey && decryptKey(encryptedKey);
    if (path) {
      if (acccessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
        setopen(false);
        router.push("/admin");
      } else setopen(true);
    }
  }, [encryptedKey]);

  const validatePasskey = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    console.log(process.env.NEXT_PUBLIC_ADMIN_PASSKEY);

    if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
      const encryptedKey = encryptKey(passkey);
      localStorage.setItem("accessKey", encryptedKey);
      setopen(false);
      router.push("/admin");
    } else setError("Invalid passkey. Please enter a valid passkey.");
  };
  const closeModal = () => {
    setopen(false);
    router.push("/");
  };
  return (
    <AlertDialog open={open} onOpenChange={setopen}>
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-start justify-between">
            Admin Access Verification
            <Image
              src="/assets/icons/close.svg"
              width={20}
              height={20}
              alt="closed"
              onClick={closeModal}
              className=" cursor-pointer"
            />
          </AlertDialogTitle>
          <AlertDialogDescription>
            To access the Admin page , Please enter the passkey.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div>
          <InputOTP
            maxLength={6}
            value={passkey}
            onChange={(value) => setPasskey(value)}
          >
            <InputOTPGroup className="shad-otp">
              <InputOTPSlot
                placeholder="0"
                className="shad-otp-slot text-green-500"
                index={0}
              />
              <InputOTPSlot
                placeholder="0"
                className="shad-otp-slot text-green-500"
                index={1}
              />
              <InputOTPSlot
                placeholder="0"
                className="shad-otp-slot text-green-500"
                index={2}
              />

              <InputOTPSlot
                placeholder="0"
                className="shad-otp-slot text-green-500"
                index={3}
              />
              <InputOTPSlot
                placeholder="0"
                className="shad-otp-slot text-green-500"
                index={4}
              />
              <InputOTPSlot
                placeholder="0"
                className="shad-otp-slot text-green-500"
                index={5}
              />
            </InputOTPGroup>
          </InputOTP>
          {error && (
            <p className="shad-error flex justify-center mt-4">{error}</p>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={(e) => validatePasskey(e)}
            className="shad-primary-btn w-full"
          >
            Enter Admin Passkey
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default PasskeyModal;
