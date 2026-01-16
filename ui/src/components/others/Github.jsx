import React from "react";
import { FaGithub } from "react-icons/fa";
import SocialBtn from "../ui/SocialBtn";
import { useStateContext } from "@/context/State";

const Github = () => {
  const { setError, isLoading } = useStateContext();

  return (
    <SocialBtn
      disabled={true}
      isLoding={isLoading}
      icon={<FaGithub />}
      name={"Github"}
    />
  );
};

export default Github;
