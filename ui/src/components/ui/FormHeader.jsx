import React from "react";
import { Logo } from "./Logo";

const FormHeader = () => {
  return (
    <div className="flex items-center gap-2">
      <Logo thickness={2} size={28} className="shrink-0" />
      <h1 className="SSN text-xl font-medium">Welcome to Fluoce</h1>
    </div>
  );
};

export default FormHeader;
