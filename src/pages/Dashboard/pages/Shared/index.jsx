import React, { useEffect, useState } from "react";
import axios from "axios";
import { message, Modal, Avatar, Checkbox, Tooltip } from "antd";
import {
  ShareAltOutlined,
  DeleteFilled,
  EditOutlined,
} from "@ant-design/icons";
import SearchBar from "../SearchBar";
import { useAuthContext } from "../../../../context/AuthContext";

const Shared = () => {
  const { token, user } = useAuthContext();

  const [notes, setNotes] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  /* -------- EDIT -------- */
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [activeNote, setActiveNote] = useState(null);
  const [formData, setFormData] = useState({ title: "", text: "" });

  /* -------- SHARE -------- */
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  /* ================= FETCH NOTES ================= */
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get("http://localhost:8000/notes/shared", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotes(res.data.notes || []);
      } catch {
        message.error("Failed to load notes");
      }
    };
    fetchNotes();
  }, [token]);

  /* ================= FETCH USERS ================= */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8000/users/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Exclude current user
        setUsers(res.data.users.filter((u) => u._id !== user._id));
      } catch {
        message.error("Failed to load users");
      }
    };
    fetchUsers();
  }, [token, user._id]);

  /* ================= DELETE NOTE ================= */
  const deleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/notes/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes((prev) => prev.filter((n) => n._id !== id));
      message.success("Note deleted");
    } catch {
      message.error("Delete failed");
    }
  };

  /* ================= UPDATE NOTE ================= */
  const updateNote = async () => {
    try {
      const res = await axios.put(
        `http://localhost:8000/notes/update/${activeNote._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Update local state
      setNotes((prev) =>
        prev.map((n) => (n._id === activeNote._id ? res.data.note : n)),
      );

      setIsEditOpen(false);
      message.success("Note updated");
    } catch {
      message.error("Update failed");
    }
  };

  /* ================= SHARE NOTE ================= */
  const shareNote = async () => {
    if (!selectedUsers.length) {
      message.warning("Select at least one user");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:8000/notes/share/${activeNote._id}`,
        { sharedWith: selectedUsers },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Update local state
      setNotes((prev) =>
        prev.map((n) => (n._id === activeNote._id ? res.data.note : n)),
      );

      message.success("Note shared successfully");
      setSelectedUsers([]);
      setIsShareSheetOpen(false);
    } catch {
      message.error("Share failed");
    }
  };

  /* ================= FILTER NOTES ================= */
  const filteredNotes = notes.filter((n) =>
    n.title?.toLowerCase().includes((searchTerm || "").toLowerCase()),
  );

  return (
    <div className="mt-8 px-5">
      {notes.length > 0 ? (
        <SearchBar onSearch={(v) => setSearchTerm(String(v))} />
      ) : (
        <p className="text-center text-gray-500">No notes found</p>
      )}

      {/* NOTES GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filteredNotes.map((note) => (
          <div
            key={note._id}
            className="bg-white rounded-2xl shadow-lg p-5 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold">{note.title}</h2>
              <div
                className="text-gray-600 line-clamp-4 mt-2"
                dangerouslySetInnerHTML={{ __html: note.text }}
              />
              <p className="text-xs text-gray-400 mt-2">
                Shared by {note.user?.firstName || "Unknown"}
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-end gap-2 mt-4">
              <Tooltip title="Edit">
                <button
                  onClick={() => {
                    setActiveNote(note);
                    setFormData({ title: note.title, text: note.text });
                    setIsEditOpen(true);
                  }}
                  className="bg-green-500 p-2 rounded-xl text-white"
                >
                  <EditOutlined />
                </button>
              </Tooltip>

              <Tooltip title="Share">
                <button
                  onClick={() => {
                    setActiveNote(note);
                    setSelectedUsers([]);
                    setIsShareSheetOpen(true);
                  }}
                  className="bg-indigo-500 p-2 rounded-xl text-white"
                >
                  <ShareAltOutlined />
                </button>
              </Tooltip>

              <Tooltip title="Delete">
                <button
                  onClick={() => deleteNote(note._id)}
                  className="bg-red-500 p-2 rounded-xl text-white"
                >
                  <DeleteFilled />
                </button>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      <Modal
        title="Edit Note"
        open={isEditOpen}
        onOk={updateNote}
        onCancel={() => setIsEditOpen(false)}
      >
        <input
          className="w-full border p-2 rounded mb-3"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <textarea
          rows={4}
          className="w-full border p-2 rounded"
          value={formData.text}
          onChange={(e) => setFormData({ ...formData, text: e.target.value })}
        />
      </Modal>

      {/* SHARE MODAL */}
      <Modal
        open={isShareSheetOpen}
        footer={null}
        closable={false}
        onCancel={() => setIsShareSheetOpen(false)}
        style={{ top: "auto", bottom: 0 }}
      >
        <div className="rounded-t-3xl">
          <h3 className="text-center font-semibold mb-3">Share with</h3>

          <div className="max-h-[300px] overflow-y-auto">
            {users.map((u) => (
              <div
                key={u._id}
                onClick={() =>
                  setSelectedUsers((prev) =>
                    prev.includes(u._id)
                      ? prev.filter((id) => id !== u._id)
                      : [...prev, u._id],
                  )
                }
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${
                  selectedUsers.includes(u._id)
                    ? "bg-indigo-100"
                    : "hover:bg-gray-100"
                }`}
              >
                <Checkbox checked={selectedUsers.includes(u._id)} />
                <Avatar>{u.firstName[0]}</Avatar>
                <span className="font-medium">
                  {u.firstName} {u.lastName}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={shareNote}
            className="w-full mt-3 py-3 bg-indigo-600 text-white rounded-xl font-semibold"
          >
            Share ({selectedUsers.length})
          </button>

          <button
            onClick={() => setIsShareSheetOpen(false)}
            className="w-full py-3 text-red-500"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Shared;
