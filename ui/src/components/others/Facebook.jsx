import React from "react";
import { FaFacebook } from "react-icons/fa";
import SocialBtn from "../ui/SocialBtn";
import { useStateContext } from "@/context/State";

const Facebook = () => {
  const { setError, isLoading } = useStateContext();

  return (
    <SocialBtn
      disabled={true}
      isLoding={isLoading}
      icon={<FaFacebook className="text-blue-500" />}
      name={"Facebook"}
    />
  );
};

export default Facebook;
