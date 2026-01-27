import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "../../Dashboard/pages/SearchBar";
import { Tag, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useAuthContext } from "../../../context/AuthContext";

const Public = () => {
  const { token } = useAuthContext();

  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedNotes, setExpandedNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH PUBLIC NOTES ---------------- */
  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/notes/public`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setNotes(res.data.notes);
      } catch (error) {
        console.error("Error fetching public notes");
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [token]);

  /* ---------------- FILTER ---------------- */
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  /* ---------------- TOGGLE EXPAND ---------------- */
  const toggleExpand = (id) => {
    setExpandedNotes((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id],
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* SEARCH */}
      <div className="flex justify-center mb-6">
        <SearchBar onSearch={setSearchTerm} />
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="flex justify-center py-24">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.length ? (
            filteredNotes.map((note) => {
              const isExpanded = expandedNotes.includes(note._id);

              return (
                <div
                  key={note._id}
                  className="relative bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                  {/* HEADER STRIP */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-2xl" />

                  {/* TITLE */}
                  <h2 className="text-lg font-semibold text-gray-800 mb-2 mt-2">
                    {note.title}
                  </h2>

                  {/* CONTENT */}
                  <div
                    className={`text-sm text-gray-600 mb-3 transition-all duration-300 ${
                      isExpanded ? "" : "line-clamp-4"
                    }`}
                    dangerouslySetInnerHTML={{ __html: note.text }}
                  />

                  <button
                    onClick={() => toggleExpand(note._id)}
                    className="text-xs text-purple-600 hover:underline mb-3"
                  >
                    {isExpanded ? "Show less" : "Read more"}
                  </button>

                  {/* AUTHOR */}
                  <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                    <UserOutlined className="text-purple-500" />
                    <span className="font-medium">
                      {note.user.firstName} {note.user.lastName}
                    </span>
                  </div>

                  {/* SHARED WITH */}
                  {note.sharedWith.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {note.sharedWith.map((u) => (
                        <Tag key={u._id} color="purple" className="text-xs">
                          {u.firstName} {u.lastName}
                        </Tag>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="col-span-3 text-center text-gray-400">
              No public notes found
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Public;
