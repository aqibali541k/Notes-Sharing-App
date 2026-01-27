import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, message, Modal, Tag, Spin, Tooltip, Avatar } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ShareAltOutlined,
  LockOutlined,
  UnlockOutlined,
  UserOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import SearchBar from "../SearchBar";
import { useAuthContext } from "../../../../context/AuthContext";

const Private = () => {
  const { token } = useAuthContext();

  /* ---------------- STATES ---------------- */
  const [notes, setNotes] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // edit
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [formData, setFormData] = useState({ title: "", text: "" });

  // share
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareNote, setShareNote] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);

  /* ---------------- FETCH NOTES ---------------- */
  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8000/notes/read", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotes(res.data.notes || []);
      } catch {
        message.error("Failed to load notes");
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [token]);

  /* ---------------- FETCH USERS ---------------- */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8000/users/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data.users || []);
      } catch {
        message.error("Failed to load users");
      }
    };
    fetchUsers();
  }, [token]);

  /* ---------------- HELPERS ---------------- */
  const toggleUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const filteredNotes = notes.filter((note) =>
    note.title?.toLowerCase().includes((searchTerm || "").toLowerCase()),
  );

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <SearchBar onSearch={(v) => setSearchTerm(String(v))} />

      {loading ? (
        <div className="flex justify-center py-24">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredNotes.length ? (
            filteredNotes.map((note) => (
              <div
                key={note._id}
                className="relative bg-white/80 backdrop-blur-xl border rounded-2xl p-5 shadow hover:shadow-xl transition"
              >
                {/* PRIVACY TAG */}
                <div className="absolute top-4 right-4">
                  <Tag
                    color={note.isPrivate ? "red" : "green"}
                    icon={
                      note.isPrivate ? <LockOutlined /> : <UnlockOutlined />
                    }
                  >
                    {note.isPrivate ? "Private" : "Public"}
                  </Tag>
                </div>

                {/* TITLE */}
                <h2 className="text-lg font-semibold mb-2">{note.title}</h2>

                {/* CONTENT */}
                <div
                  className="text-gray-600 text-sm line-clamp-4 mb-4"
                  dangerouslySetInnerHTML={{ __html: note.text }}
                />

                {/* OWNER */}
                <p className="text-xs text-gray-400 mb-3">
                  👤 {note.user?.firstName} {note.user?.lastName}
                </p>

                {/* ACTIONS */}
                <div className="flex justify-end gap-2">
                  {/* EDIT */}
                  <Tooltip title="Edit">
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => {
                        setCurrentNote(note);
                        setFormData({
                          title: note.title,
                          text: note.text,
                        });
                        setIsEditOpen(true);
                      }}
                    />
                  </Tooltip>

                  {/* SHARE */}
                  <Tooltip title="Share">
                    <Button
                      icon={<ShareAltOutlined />}
                      onClick={() => {
                        setShareNote(note);
                        setSelectedUsers([]);
                        setIsShareOpen(true);
                      }}
                    />
                  </Tooltip>

                  {/* PUBLIC / PRIVATE */}
                  <Tooltip
                    title={note.isPrivate ? "Make Public" : "Make Private"}
                  >
                    <Button
                      icon={
                        note.isPrivate ? <UnlockOutlined /> : <LockOutlined />
                      }
                      onClick={async () => {
                        try {
                          const res = await axios.put(
                            `http://localhost:8000/notes/privacy/${note._id}`,
                            { isPrivate: !note.isPrivate },
                            {
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                            },
                          );

                          setNotes((prev) =>
                            prev.map((n) =>
                              n._id === note._id ? res.data.note : n,
                            ),
                          );

                          message.success("Privacy updated");
                        } catch {
                          message.error("Privacy update failed");
                        }
                      }}
                    />
                  </Tooltip>

                  {/* DELETE */}
                  <Tooltip title="Delete">
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={async () => {
                        try {
                          await axios.delete(
                            `http://localhost:8000/notes/delete/${note._id}`,
                            {
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                            },
                          );
                          setNotes((prev) =>
                            prev.filter((n) => n._id !== note._id),
                          );
                          message.success("Note deleted");
                        } catch {
                          message.error("Delete failed");
                        }
                      }}
                    />
                  </Tooltip>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-3 text-center text-gray-500">
              No notes found
            </p>
          )}
        </div>
      )}

      {/* EDIT MODAL */}
      <Modal
        title="Edit Note"
        open={isEditOpen}
        onCancel={() => setIsEditOpen(false)}
        onOk={async () => {
          try {
            const res = await axios.put(
              `http://localhost:8000/notes/update/${currentNote._id}`,
              formData,
              {
                headers: { Authorization: `Bearer ${token}` },
              },
            );

            setNotes((prev) =>
              prev.map((n) => (n._id === currentNote._id ? res.data.note : n)),
            );

            message.success("Note updated");
            setIsEditOpen(false);
          } catch {
            message.error("Update failed");
          }
        }}
      >
        <input
          className="w-full border rounded p-2 mb-3"
          value={formData.title}
          onChange={(e) =>
            setFormData({
              ...formData,
              title: e.target.value,
            })
          }
        />
        <textarea
          rows="4"
          className="w-full border rounded p-2"
          value={formData.text}
          onChange={(e) =>
            setFormData({
              ...formData,
              text: e.target.value,
            })
          }
        />
      </Modal>

      {/* SHARE MODAL (MULTI USER) */}
      <Modal
        title={`Share Note (${selectedUsers.length})`}
        open={isShareOpen}
        onCancel={() => setIsShareOpen(false)}
        onOk={async () => {
          if (!selectedUsers.length) {
            message.warning("Select at least one user");
            return;
          }
          try {
            const res = await axios.post(
              `http://localhost:8000/notes/share/${shareNote._id}`,
              { sharedWith: selectedUsers },
              {
                headers: { Authorization: `Bearer ${token}` },
              },
            );

            setNotes((prev) =>
              prev.map((n) => (n._id === shareNote._id ? res.data.note : n)),
            );

            message.success("Note shared");
            setIsShareOpen(false);
          } catch {
            message.error("Share failed");
          }
        }}
      >
        <div className="max-h-72 overflow-y-auto space-y-2">
          {users.map((u) => {
            const selected = selectedUsers.includes(u._id);
            return (
              <div
                key={u._id}
                onClick={() => toggleUser(u._id)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border
                  ${
                    selected
                      ? "bg-green-50 border-green-400"
                      : "hover:bg-gray-100 border-transparent"
                  }`}
              >
                <Avatar size={40} src={u.avatar} icon={<UserOutlined />} />
                <div className="flex-1">
                  <p className="font-medium">
                    {u.firstName} {u.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{u.email}</p>
                </div>
                {selected && (
                  <CheckOutlined className="text-green-600 text-lg" />
                )}
              </div>
            );
          })}
        </div>
      </Modal>
    </div>
  );
};

export default Private;
