import React from "react";
import {
  BarChartOutlined,
  FileAddOutlined,
  HomeFilled,
  LockOutlined,
  MenuOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useTabContext } from "../../../../context/TabContext";

const Sider = () => {
  const { isSiderOpen, setIsSiderOpen, currentTab, setCurrentTab } =
    useTabContext();

  const menuItems = [
    {
      key: "Analytics",
      label: "Analytics",
      icon: <BarChartOutlined />,
      path: "/dashboard/analytics",
    },
    {
      key: "Profile",
      label: "Profile",
      icon: <UserOutlined />,
      path: "/dashboard/profile",
    },
    {
      key: "New_Notes",
      label: "New Notes",
      icon: <FileAddOutlined />,
      path: "/dashboard/new-notes",
    },
    {
      key: "Shared_Notes",
      label: "Shared Notes",
      icon: <TeamOutlined />,
      path: "/dashboard/shared",
    },
    {
      key: "Private_Notes",
      label: "Private Notes",
      icon: <LockOutlined />,
      path: "/dashboard/private",
    },
  ];

  return (
    <>
      {/* ===== MOBILE OVERLAY ===== */}
      {isSiderOpen && (
        <div
          onClick={() => setIsSiderOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 sm:hidden"
        />
      )}

      {/* ===== SIDER ===== */}
      <div
        className={`
          fixed top-0 left-0 bottom-0 z-50
          bg-gradient-to-b from-blue-600 via-indigo-600 to-purple-600
          text-white shadow-xl transition-all duration-300
          ${isSiderOpen ? "w-60 translate-x-0" : "w-16 -translate-x-full sm:translate-x-0"}
        `}
      >
        {/* ===== TOP ===== */}
        <div className="flex items-center justify-between p-3 border-b border-white/20">
          <button
            onClick={() => setIsSiderOpen(!isSiderOpen)}
            className="w-10 h-10 flex items-center justify-center bg-white text-black rounded-lg"
          >
            <MenuOutlined />
          </button>

          {isSiderOpen && (
            <Link
              to="/"
              className="w-10 h-10 flex items-center justify-center bg-white text-black rounded-lg"
            >
              <HomeFilled />
            </Link>
          )}
        </div>

        {/* ===== MENU ===== */}
        <nav className="flex flex-col gap-1 mt-4 px-2">
          {menuItems.map((item) => (
            <Link
              key={item.key}
              to={item.path}
              onClick={() => {
                setCurrentTab(item.key);
                setIsSiderOpen(false);
              }}
              className={`
                group relative flex items-center gap-3 px-3 py-2 rounded-lg
                transition-all duration-200
                ${
                  currentTab === item.key
                    ? "bg-white text-black font-semibold"
                    : "hover:bg-white/20"
                }
              `}
            >
              <span className="text-lg">{item.icon}</span>

              {isSiderOpen && <span>{item.label}</span>}

              {!isSiderOpen && (
                <span
                  className="absolute left-14 bg-black text-white text-sm px-2 py-1
                  rounded-md opacity-0 -translate-x-2
                  group-hover:opacity-100 group-hover:translate-x-0
                  transition-all duration-300 whitespace-nowrap z-50"
                >
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sider;
