import React from "react";
import { useGoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import SocialBtn from "../ui/SocialBtn";
import { useStateContext } from "@/context/State";
import useAuthApi from "@/api/auth-api";

const GoogleLoginBtn = () => {
  const { setError, isLoading, refUrl } = useStateContext();

  const { googleAuth } = useAuthApi();

  const handleGoogleResponse = async (result) => {
    if (result?.code) {
      const success = await googleAuth(result.code);
      if (success && success.code) {
        if (refUrl) {
          window.location.replace(refUrl + `?code=${success?.code}`);
          localStorage.removeItem("refUrl");
        }
      }
    } else {
      setError("Google login failed !");
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleResponse,
    onError: (err) => {
      setError("Google login failed !");
    },
    flow: "auth-code",
  });

  return (
    <SocialBtn
      icon={<FcGoogle />}
      name={"Google"}
      onClick={() => googleLogin()}
      isLoding={isLoading}
    />
  );
};

const Google = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <GoogleLoginBtn />
    </GoogleOAuthProvider>
  );
};

export default Google;
