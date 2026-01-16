import React from "react";
import SocialBtn from "../ui/SocialBtn";
import { FaApple } from "react-icons/fa6";
import { useStateContext } from "@/context/State";

const Apple = () => {
  const { setError, isLoading } = useStateContext();

  return (
    <SocialBtn
      disabled={true}
      isLoding={isLoading}
      icon={<FaApple className="text-neutral-600" />}
      name={"Apple"}
    />
  );
};

export default Apple;
