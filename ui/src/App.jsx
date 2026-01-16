import React from "react";
import SignUp from "./components/view/SignUp";
import { Route, Routes } from "react-router-dom";
import Verify from "./components/view/Verify";

const App = () => {
  return (
    <div className="flex w-full items-start justify-center p-2 pt-8">
      <Routes>
        <Route path="/" element={404} />
        <Route path="/auth" element={<SignUp />} />
        <Route path="/auth/verify" element={<Verify />} />
      </Routes>
    </div>
  );
};

export default App;
