import useAuthApi from "@/api/auth-api";
import { useStateContext } from "@/context/State";
import React from "react";
import { useForm } from "react-hook-form";
import FormHeader from "../ui/FormHeader";
import { Input } from "../ui/input";
import SendBtn from "../ui/SendBtn";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { COUNTRY } from "@/configs/phone";
import { Kbd } from "../ui/kbd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SingupWithPhone = () => {
  const [countryNumberPrefix, setCountryNumberPrefix] = useState(
    COUNTRY[75]?.numberPrefix
  );

  const navigate = useNavigate();

  const { isLoading, error, refUrl, setError } = useStateContext();

  const { phoneAuth } = useAuthApi();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const singUpWithPhone = async (data) => {
    if (data.phone !== "9313194110") {
      setError(
        "Phone login is currently in testing and only available for a specific phone number."
      );
      return;
    } else {
      setError("");
    }
    const success = await phoneAuth({
      phone: `${countryNumberPrefix}${data?.phone}`,
    });
    if (success) {
      navigate("/auth/phone/verify");
    }
  };

  return (
    <div className="flex w-80 flex-col gap-8">
      <div className="flex flex-col items-start gap-1.5">
        <FormHeader />
        <p className="p-0.5 text-xs font-medium text-zinc-700">
          Enter your phone number below to continue.
        </p>
      </div>
      <div className="flex flex-col gap-6">
        <form
          onSubmit={handleSubmit(singUpWithPhone)}
          className="flex items-center justify-center gap-3"
        >
          <Select
            value={countryNumberPrefix}
            onValueChange={setCountryNumberPrefix}
          >
            <SelectTrigger className="cursor-pointer py-3">
              <SelectValue placeholder="">
                {countryNumberPrefix
                  ? COUNTRY?.find((c) => c.numberPrefix == countryNumberPrefix)
                      ?.numberPrefix
                  : ""}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {COUNTRY.map((c) => (
                <SelectItem
                  className="cursor-pointer rounded-none border-b p-0 py-2"
                  key={c.value}
                  value={String(c.numberPrefix)}
                >
                  <Kbd>{c.numberPrefix}</Kbd> {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            className="p-5.5 text-sm placeholder:text-sm"
            type="tel"
            placeholder="Phone"
            {...register("phone", {
              required: "Phone number is required",
              validate: (value) => {
                const country = COUNTRY.find(
                  (c) => c.numberPrefix == countryNumberPrefix
                );
                if (!country) {
                  return "Invalid country code";
                }
                const length = country.numberLength;
                if (value.length !== length) {
                  return `Phone number must be ${length} digits`;
                }
                return true;
              },
              pattern: {
                value: /^[0-9]*$/,
                message: "Enter a valid phone number",
              },
            })}
          />
          <SendBtn isLoading={isLoading} type="submit" />
        </form>
        {errors.phone && (
          <span className="flex items-center justify-center text-xs font-medium text-red-500">
            {errors.phone.message}
          </span>
        )}
      </div>
      {error && (
        <span className="flex items-center justify-center text-[13px] font-medium text-red-500">
          {error}
        </span>
      )}
      <div className="flex items-center justify-between gap-2 text-[10px] font-medium text-zinc-400">
        <Button
          onClick={() => {
            navigate(`/auth?ref=${refUrl}`);
          }}
          variant="ghost"
        >
          Back
        </Button>
      </div>
    </div>
  );
};

export default SingupWithPhone;
