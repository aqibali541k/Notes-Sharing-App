import React, { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, Button, Input, message, Spin } from "antd";
import {
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useAuthContext } from "../../../../context/AuthContext";

const Profile = () => {
  const { token, isAuth } = useAuthContext();

  const [profile, setProfile] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [preview, setPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    if (!isAuth) return;

    const fetchProfile = async () => {
      try {
        setIsLoading(true);

        const res = await axios.get("http://localhost:8000/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(res.data.user);
        setFormData({
          firstName: res.data.user.firstName,
          lastName: res.data.user.lastName,
          email: res.data.user.email,
          dob: res.data.user.dob || "",
          image: null,
        });
      } catch (err) {
        console.error(err);
        message.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [token, isAuth]);

  /* ================= AUTH CHECK ================= */
  if (!isAuth) {
    return (
      <h2 className="text-center mt-10 text-red-500 font-bold">
        Please login to view your profile
      </h2>
    );
  }

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData({ ...formData, image: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    try {
      setIsLoading(true);

      const fd = new FormData();
      fd.append("firstName", formData.firstName);
      fd.append("lastName", formData.lastName);
      fd.append("email", formData.email);
      fd.append("dob", formData.dob);

      if (formData.image) {
        fd.append("image", formData.image);
      }

      const res = await axios.put("http://localhost:8000/users/update", fd, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile(res.data.user);
      setEditMode(false);
      setPreview("");
      message.success("Profile updated successfully");
    } catch (err) {
      console.error(err);
      message.error("Profile update failed");
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-white to-yellow-100 p-6 relative">
      {/* GLOBAL LOADER */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/60 z-50 flex items-center justify-center">
          <Spin size="large" />
        </div>
      )}

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Welcome, {profile.firstName}</h2>

          <div className="flex gap-2">
            <Button
              loading={isLoading}
              icon={editMode ? <CheckOutlined /> : <EditOutlined />}
              type={editMode ? "primary" : "default"}
              onClick={() => (editMode ? handleUpdate() : setEditMode(true))}
            />
            {editMode && (
              <Button
                icon={<CloseOutlined />}
                onClick={() => {
                  setEditMode(false);
                  setPreview("");
                }}
              />
            )}
          </div>
        </div>

        {/* AVATAR */}
        <div className="flex items-center gap-4 mb-8">
          <Avatar
            size={90}
            src={preview || profile.image}
            icon={<UserOutlined />}
          />

          {editMode && (
            <input type="file" accept="image/*" onChange={handleImageChange} />
          )}
        </div>

        {/* FIELDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Field
            label="First Name"
            name="firstName"
            editMode={editMode}
            formData={formData}
            handleChange={handleChange}
          />
          <Field
            label="Last Name"
            name="lastName"
            editMode={editMode}
            formData={formData}
            handleChange={handleChange}
          />
          <Field
            label="Email"
            name="email"
            editMode={editMode}
            formData={formData}
            handleChange={handleChange}
          />
          <Field
            label="DOB"
            name="dob"
            type="date"
            editMode={editMode}
            formData={formData}
            handleChange={handleChange}
          />

          <div>
            <span className="text-gray-500 text-sm">Created At</span>
            <div className="bg-gray-50 p-3 rounded-lg">
              {profile.createdAt
                ? new Date(profile.createdAt).toLocaleDateString()
                : "N/A"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= FIELD COMPONENT ================= */

const Field = ({
  label,
  name,
  type = "text",
  editMode,
  formData,
  handleChange,
}) => (
  <div>
    <span className="text-gray-500 text-sm">{label}</span>
    {editMode ? (
      <Input
        type={type}
        name={name}
        value={formData[name] || ""}
        onChange={handleChange}
      />
    ) : (
      <div className="bg-gray-50 p-3 rounded-lg">{formData[name] || "N/A"}</div>
    )}
  </div>
);

export default Profile;
