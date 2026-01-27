import React, { useState } from "react";
import { Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import {
  LoadingOutlined,
  LoginOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const Navbar = () => {
  const { isAuth, handleLogout } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-lg backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo → always goes to Public */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-wide cursor-pointer"
        >
          Notes
        </Link>

        {/* Desktop menu */}
        <ul className="hidden md:flex space-x-8">
          <Link to="/" className="relative group cursor-pointer">
            Public
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-500 group-hover:w-full"></span>
          </Link>

          <li
            className="relative group cursor-pointer"
            onClick={() => navigate("/dashboard/analytics")}
          >
            Dashboard
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-500 group-hover:w-full"></span>
          </li>
        </ul>

        {/* Auth buttons */}
        <div className="hidden md:flex">
          {!isAuth ? (
            <Link to="/auth/login">
              <Button className="!text-white !bg-green-600 !border-none !rounded-2xl">
                <LoginOutlined />
              </Button>
            </Link>
          ) : (
            <Button
              className="!text-white !bg-red-600 !border-none !rounded-2xl"
              onClick={handleLogout}
            >
              <LogoutOutlined />
            </Button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden bg-transparent border-0 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <FontAwesomeIcon icon={faTimes} size="xl" />
          ) : (
            <FontAwesomeIcon icon={faBars} size="xl" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <ul className="md:hidden flex flex-col px-4 pb-4 space-y-4 animate-slideDown">
          <Link to="/" className="relative group cursor-pointer">
            Public
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-500 group-hover:w-full"></span>
          </Link>

          <li
            className="relative group cursor-pointer"
            onClick={() => navigate("/dashboard/analytics")}
          >
            Dashboard
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-500 group-hover:w-full"></span>
          </li>

          <div className="absolute right-5 top-30">
            {!isAuth ? (
              <Link to="/auth/login">
                <Button className="!text-white !bg-green-600 !border-none !rounded-2xl">
                  Login
                </Button>
              </Link>
            ) : (
              <Button
                className="!text-white !bg-red-600 !border-none !rounded-2xl"
                onClick={handleLogout}
              >
                <LogoutOutlined />
              </Button>
            )}
          </div>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
