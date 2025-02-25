"use client"; // This makes the component interactive

import { SignUpForm } from "@/components/signup-form";
import React from "react";

function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="w-full max-w-md p-4">
        <SignUpForm />
      </div>
    </div>
  );
}

export default Page;
