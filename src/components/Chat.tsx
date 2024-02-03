"use client";
import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

interface ChatMessage {
  role: string;
  content: string;
}

interface Part {
  text: string;
}

const Chat = () => {
  const [question, setQuestion] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const sendMessage = async () => {
    const userMessage: ChatMessage = { role: "user", content: question };
    const updatedChatHistory = [...chatHistory, userMessage];

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`,
        {
          contents: [{ parts: [{ text: question }] }], 
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const chatAnswer = response.data;
      let botMessageContent = "";

      if (
        chatAnswer &&
        chatAnswer.candidates &&
        chatAnswer.candidates.length > 0
      ) {
        const firstCandidate = chatAnswer.candidates[0].content;
        if (
          firstCandidate &&
          firstCandidate.parts &&
          firstCandidate.parts.length > 0
        ) {
          botMessageContent = firstCandidate.parts
            .map((part: Part) => part.text)
            .join("\n");
        }
      }

      const botMessage: ChatMessage = {
        role: "system",
        content: botMessageContent,
      };

      setChatHistory([...updatedChatHistory, botMessage]);
    } catch (error) {
      console.error("Google API error:", error);
    }

    setQuestion("");
  };

  const renderChatMessage = (message: ChatMessage) => {
    if (message.role === "system") {
      return <ReactMarkdown>{message.content}</ReactMarkdown>;
    }
    return <div>{message.content}</div>;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-y-auto grow p-5 mb-3">
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`p-4 my-3 rounded-md ${
              chat.role === "user"
                ? "bg-blue-100 text-black"
                : "bg-red-100 text-gray-800"
            }`}
          >
            {renderChatMessage(chat)}
          </div>
        ))}
      </div>
      <div className="flex space-x-0 p-2 bg-white fixed bottom-0 left-0 right-0 shadow">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="flex-1 py-2 px-3 text-base rounded-sm outline-none focus:outline-blue-800 outline-blue-300 mr-3"
        />
        <button
          onClick={sendMessage}
          className="py-5 px-8 bg-blue-800 text-white text-base rounded hover:bg-blue-300 cursor-pointer"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
