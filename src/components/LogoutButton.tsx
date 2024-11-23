"use client";
import { signOutAction } from "@/lib/actions/patient.action";
import React from "react";
import { Button } from "./ui/button";

function LogoutButton() {
  const handleLogOut = async () => {
    await signOutAction();
  };

  return (
    <Button
      onClick={handleLogOut}
      variant="secondary"
      className="bg-gray-400 rounded text-dark-400 hover:text-white"
    >
      Log Out
    </Button>
  );
}

export default LogoutButton;
