"use client"; // This makes the component interactive

import { LoginForm } from "@/components/login-form";
import React from "react";

function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="w-full max-w-md p-4">
        <LoginForm />
      </div>
    </div>
  );
}

export default Page;
