import React, { useState } from "react";
import { Button, Col, Form, Input, message, Row, Card } from "antd";
import Title from "antd/es/typography/Title";
import ReactQuill from "react-quill-new";
import axios from "axios";
import { useAuthContext } from "../../../../context/AuthContext";

const initialState = { title: "", text: "", isPrivate: true, sharedWith: [] };

const CreateNotes = () => {
  const { token } = useAuthContext();
  const [state, setState] = useState(initialState);

  const handleChange = (e) =>
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleTextChange = (value) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = value;
    setState((s) => ({
      ...s,
      text: tempDiv.textContent || tempDiv.innerText || "",
    }));
  };

  const handleSubmit = async () => {
    if (!state.title || !state.text)
      return message.warning("Title and content are required");

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/notes/create`, state, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("✨ Note saved");
      setState(initialState);
    } catch {
      message.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-100 px-4">
      <Card
        className="w-full max-w-3xl rounded-2xl shadow-lg border border-slate-200"
        bodyStyle={{ padding: "28px" }}
      >
        <Title level={3} className="!text-slate-700 !mb-6 text-center">
          Create a new note
        </Title>

        <Form layout="vertical">
          <Row gutter={[16, 22]}>
            {/* Title */}
            <Col span={24}>
              <Form.Item label="Title">
                <Input
                  name="title"
                  value={state.title}
                  onChange={handleChange}
                  placeholder="Eg. Data Structures – Short Notes"
                  size="large"
                  className="rounded-xl focus:shadow-md"
                />
              </Form.Item>
            </Col>

            {/* Content */}
            <Col span={24}>
              <Form.Item label="Content">
                <ReactQuill
                  value={state.text}
                  onChange={handleTextChange}
                  placeholder="Start typing your thoughts..."
                  modules={{ toolbar: false }}
                  className="rounded-xl border border-slate-300 min-h-[200px] bg-white"
                />
              </Form.Item>
            </Col>

            {/* Action */}
            <Col span={24} className="flex justify-end">
              <Button
                type="primary"
                size="large"
                onClick={handleSubmit}
                className="rounded-xl px-10 bg-indigo-600 hover:bg-indigo-500 shadow-md"
              >
                Save Note
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default CreateNotes;
