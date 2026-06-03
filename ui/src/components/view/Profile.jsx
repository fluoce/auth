import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LuUserRound } from "react-icons/lu";
import { Button } from "../ui/button";
import { FiUpload } from "react-icons/fi";
import FormHeader from "../ui/FormHeader";
import { Input } from "../ui/input";
import { AiOutlinePlus } from "react-icons/ai";
import { LuLogOut } from "react-icons/lu";

const user = {
  id: "user_01KT0QB07ZM6X8S301DSK61J5D",
  name: "AJx2 - Ashit Mulani",
  email: "",
  phone: "",
  photo: "https://me.fluoce.com/favicon.svg",
  createdAt: "2026-06-01T04:33:42.176Z",
  updatedAt: "2026-06-01T11:26:07.210Z",
};

const Profile = () => {
  return (
    <div className="flex w-80 flex-col gap-8">
      <div className="flex flex-col items-start gap-1.5">
        <FormHeader title="Your Fluoce Profile" />
        <p className="p-0.5 text-xs font-medium text-zinc-700">
          Manage your profile settings below. You can change your name and
          update your photo.{" "}
          <span className="cursor-pointer text-blue-500 underline hover:text-blue-700">
            switch account
          </span>
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-4">
          <div className="h-16 w-16 gap-2 overflow-hidden rounded-xl border">
            <Avatar className="h-full w-full rounded-none">
              <AvatarImage src={user?.photo} />
              <AvatarFallback className="rounded-none">
                <LuUserRound />
              </AvatarFallback>
            </Avatar>
          </div>
          <Button variant="outline" size="xs" className="text-blue-500">
            <FiUpload /> {user?.photo ? "Update" : "Add"}
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <div className="flex flex-col gap-2">
            <Input id="name" value={user?.name || "No name"} />
            <Button variant="outline" size="sm" className="w-fit text-blue-500">
              Update
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <div className="flex flex-col gap-2">
          <Input
            id="email"
            value={user?.email || "No email"}
            disabled
            className="disabled:opacity-100"
          />
          {!user?.email ? (
            <Button variant="outline" size="sm" className="w-fit text-blue-500">
              <AiOutlinePlus /> email
            </Button>
          ) : null}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="phone" className="text-sm font-medium">
          Phone
        </label>
        <div className="flex flex-col gap-2">
          <Input
            id="phone"
            value={user?.phone || "No phone"}
            disabled
            className="disabled:opacity-100"
          />
          {!user?.phone ? (
            <Button variant="outline" size="sm" className="w-fit text-blue-500">
              <AiOutlinePlus /> Phone
            </Button>
          ) : null}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Logout</span>
        <p className="text-muted-foreground text-xs">
          Log out from all devices, apps, and websites.
          <br /> Use if your account is at risk.
        </p>
        <Button size="sm" variant="outline" className="w-fit text-red-500">
          <LuLogOut /> Logout
        </Button>
      </div>
    </div>
  );
};

export default Profile;
