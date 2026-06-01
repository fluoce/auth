import React from "react";
import SocialBtn from "../ui/SocialBtn";
import { MdPermPhoneMsg } from "react-icons/md";
import { useStateContext } from "@/context/State";
import { useNavigate } from "react-router-dom";

const Phone = () => {
  const { isLoading } = useStateContext();

  const navigate = useNavigate();

  return (
    <SocialBtn
      onClick={() => {
        navigate("/auth/phone");
      }}
      icon={<MdPermPhoneMsg className="text-emerald-600" />}
      name={"Phone"}
      isLoding={isLoading}
    />
  );
};

export default Phone;
