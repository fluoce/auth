import React from "react";
import SignUp from "./components/view/SignUp";
import { Route, Routes } from "react-router-dom";
import Verify from "./components/view/Verify";
import SingupWithPhone from "./components/view/SingupWithPhone";
import VerifyPhone from "./components/view/VerifyPhone";

const App = () => {
  return (
    <div className="flex w-full items-start justify-center p-2 pt-8">
      <Routes>
        <Route path="/" element={404} />
        <Route path="/auth" element={<SignUp />} />
        <Route path="/auth/verify" element={<Verify />} />
        <Route path="/auth/phone" element={<SingupWithPhone />} />
        <Route path="/auth/phone/verify" element={<VerifyPhone />} />
      </Routes>
    </div>
  );
};

export default App;
