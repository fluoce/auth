import React, { useEffect } from "react";
import Google from "../others/Google";
import { Input } from "../ui/input";
import { useStateContext } from "@/context/State";
import { useLocation, useNavigate } from "react-router-dom";
import SendBtn from "../ui/SendBtn";
import { useForm } from "react-hook-form";
import FormHeader from "../ui/FormHeader";
import useAuthApi from "@/api/auth-api";
import { Button } from "../ui/button";
import { getHomeUrl } from "@/utils/getRefUrl";
import Github from "../others/Github";

const SignUp = () => {
  const { error, setRefUrl, refUrl, isLoading, lastUsedSocial } =
    useStateContext();

  const { emailAuth } = useAuthApi();

  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get("ref");

    if (ref) {
      setRefUrl(ref);
    }
  }, [location.search]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const singUpWithEmail = async (data) => {
    const success = await emailAuth(data);
    if (success) {
      navigate("/auth/verify");
    }
  };

  return (
    <div className="flex w-70 flex-col gap-8">
      <div className="flex flex-col items-start gap-1.5">
        <FormHeader />
        <p className="p-0.5 text-xs font-medium text-zinc-700">
          Sign up with email or continue with a social. Quick, simple, and
          secure.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <form
          onSubmit={handleSubmit(singUpWithEmail)}
          className="flex items-center justify-center gap-3"
        >
          <Input
            className="p-5.5 text-sm placeholder:text-sm"
            type="email"
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
            })}
          />
          <SendBtn isLoading={isLoading} type="submit" />
        </form>
        {errors.email && (
          <span className="flex items-center justify-center text-xs font-medium text-red-500">
            {errors.email.message}
          </span>
        )}
        {lastUsedSocial && ["google", "github"].includes(lastUsedSocial) && (
          <>
            <div className="flex items-center justify-center gap-1">
              <span className="flex-1 border-t"></span>
              <span className="-mt-1 shrink-0 text-xs font-medium text-zinc-500/50">
                last used
              </span>
              <span className="flex-1 border-t"></span>
            </div>
            <div className="rounded-md bg-green-500/20">
              {lastUsedSocial === "google" && <Google />}
              {lastUsedSocial === "github" && <Github />}
            </div>
          </>
        )}
        <div className="flex items-center justify-center gap-1">
          <span className="flex-1 border-t"></span>
          <span className="-mt-1 shrink-0 text-xs font-medium text-zinc-500/50">
            or continue with
          </span>
          <span className="flex-1 border-t"></span>
        </div>
        <div className="flex flex-col gap-2">
          <Google />
          <Github />
        </div>
        {error && (
          <span className="flex items-center justify-center text-[13px] font-medium text-red-500">
            {error}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between gap-2 text-[10px] font-medium text-zinc-400">
        {refUrl && /^http(s)?:\/\//.test(refUrl) && (
          <Button
            onClick={() => {
              const url = getHomeUrl(refUrl);
              if (url) {
                window.location.replace(url);
              }
            }}
            variant="ghost"
          >
            Back
          </Button>
        )}
        <p className="flex w-full items-center justify-end gap-2">
          <span className="hover:text-blue-600 hover:underline">
            Terms of Use
          </span>
          |
          <span className="hover:text-blue-600 hover:underline">
            Privacy Policy
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
