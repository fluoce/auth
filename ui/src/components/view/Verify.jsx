import { useStateContext } from "@/context/State";
import React from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import SendBtn from "../ui/SendBtn";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import FormHeader from "../ui/FormHeader";
import useAuthApi from "@/api/auth-api";

const Verify = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  const { error, refUrl, user, isLoading, setError, setLastUsedSocial } =
    useStateContext();

  const { verifyEmail } = useAuthApi();

  const verify = async (data) => {
    const success = await verifyEmail({ otp: data?.otp, email: user?.email });
    if (success && success.code) {
      if (refUrl && /^http(s)?:\/\//.test(refUrl)) {
        window.location.replace(refUrl + `?code=${success?.code}`);
        localStorage.removeItem("refUrl");
      } else {
        setError("redirect url not found go back to main site");
      }
      setLastUsedSocial(null);
    }
  };

  return (
    <div className="flex w-70 flex-col gap-8">
      <div className="flex flex-col items-start gap-1.5">
        <FormHeader />
        <p className="p-0.5 text-xs font-medium text-zinc-700">
          Enter the 4-digit code we just sent to{" "}
          {user?.email ? (
            <span className="font-semibold">{user?.email}</span>
          ) : (
            <span className="text-red-600">
              your email address (not found), retry
            </span>
          )}
        </p>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-start gap-1.5">
          <form
            className="flex w-full items-center justify-between gap-3"
            onSubmit={handleSubmit(verify)}
          >
            <Controller
              name="otp"
              control={control}
              rules={{
                required: "Code is required",
                pattern: {
                  value: /^\d{4}$/,
                  message: "Enter a valid 4-digit code",
                },
              }}
              render={({ field }) => (
                <InputOTP
                  maxLength={4}
                  pattern={REGEXP_ONLY_DIGITS}
                  value={field.value}
                  onChange={field.onChange}
                >
                  <InputOTPGroup className="gap-2">
                    <InputOTPSlot
                      className="rounded-md border p-5.5"
                      index={0}
                    />
                    <InputOTPSlot
                      className="rounded-md border p-5.5"
                      index={1}
                    />
                    <InputOTPSlot
                      className="rounded-md border p-5.5"
                      index={2}
                    />
                    <InputOTPSlot
                      className="rounded-md border p-5.5"
                      index={3}
                    />
                  </InputOTPGroup>
                </InputOTP>
              )}
            />
            <SendBtn isLoading={isLoading} type="submit" />
          </form>
          <span className="ml-0.5 text-xs font-medium text-zinc-500">
            One-time password
          </span>
          {errors.otp && (
            <span className="flex items-center justify-center text-xs font-medium text-red-500">
              {errors.otp.message}
            </span>
          )}
        </div>
        <div className="flex items-center justify-end gap-1.5 font-medium">
          <span className="text-xs text-zinc-500">Didn't receive a code ?</span>
          <Link
            aria-disabled={isLoading}
            onClick={() => setError(null)}
            className="cursor-pointer text-xs text-blue-600 hover:underline"
            to={`/auth?ref=${refUrl}`}
          >
            Retry
          </Link>
        </div>
        {error && (
          <span className="flex items-center justify-center text-[13px] font-medium text-red-500">
            {error}
          </span>
        )}
      </div>
    </div>
  );
};

export default Verify;
