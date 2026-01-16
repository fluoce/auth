import React from "react";
import { Button } from "./button";

const SocialBtn = ({ icon, name, onClick, isLoding, disabled }) => {
  return (
    <Button
      disabled={isLoding || disabled}
      variant="outline"
      onClick={onClick}
      className="flex w-full items-center gap-2 p-5.5 font-medium"
    >
      {icon}
      {name}
    </Button>
  );
};

export default SocialBtn;
