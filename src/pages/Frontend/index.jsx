import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Navigate, Route, Routes } from "react-router-dom";
import Public from "./Public";
import { useAuthContext } from "../../context/AuthContext";

const Frontend = () => {
  const { isAuth } = useAuthContext();
  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      {/* Main content grows to fill remaining space */}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Public />} />
          {/* <Route
            path="/shared"
            element={isAuth ? <Shared /> : <Navigate to="/auth/login" />}
          />
          <Route
            path="/private"
            element={isAuth ? <Private /> : <Navigate to="/auth/login" />}
          /> */}
        </Routes>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
};

export default Frontend;
