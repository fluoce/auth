import React from "react";
import { Button } from "./button";
import { BsArrowUpRight } from "react-icons/bs";
import { Loader } from "./Loader";

const SendBtn = ({ onClick, type = "button", isLoading = false }) => {
  return (
    <Button
      disabled={isLoading}
      onClick={onClick}
      type={type}
      variant="outline"
      className="p-5.5"
      size="icon"
    >
      {isLoading ? (
        <Loader />
      ) : (
        <BsArrowUpRight strokeWidth={1} className="text-blue-500" />
      )}
    </Button>
  );
};

export default SendBtn;
