"use client";
import { useState } from "react";
import { css } from "@emotion/css";
import axios from "axios";
import ReactMarkdown from "react-markdown";

interface ChatMessage {
  role: string;
  content: string;
}

interface Part {
  text: string;
}

const chatContainerStyle = css`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
`;

const chatHistoryStyle = css`
  overflow-y: auto;
  flex-grow: 1;
  padding: 20px;
  margin-bottom: 60px;
`;

const userMessageStyle = css`
  margin-bottom: 10px;
  padding: 10px;
  background-color: #e1f5fe;
  border-radius: 10px;
  max-width: 70%;
  align-self: flex-end;
`;

const botMessageStyle = css`
  margin-bottom: 10px;
  padding: 10px;
  background-color: #ede7f6;
  border-radius: 10px;
  max-width: 70%;
  align-self: flex-start;
`;

const inputStyle = css`
  flex: 1;
  padding: 10px 15px;
  font-size: 16px;
  border: 2px solid #dedede;
  border-radius: 4px;
  margin-right: 10px;
`;

const buttonStyle = css`
  padding: 10px 20px;
  background-color: #5c6bc0;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #3949ab;
  }
`;

const inputAreaStyle = css`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #fafafa;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  box-shadow: 0 -1px 10px rgba(0, 0, 0, 0.1);
`;

const Chat = () => {
  const [input, setInput] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const sendMessage = async () => {
    const userMessage: ChatMessage = { role: "user", content: input };
    // 画面上の会話履歴を更新
    const updatedChatHistory = [...chatHistory, userMessage];

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`,
        {
          contents: [{ parts: [{ text: input }] }], // 現在のメッセージのみを送信
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // APIからの応答を処理
      const botResponse = response.data;
      let botMessageContent = "";

      if (
        botResponse &&
        botResponse.candidates &&
        botResponse.candidates.length > 0
      ) {
        const firstCandidate = botResponse.candidates[0].content;
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

      // 会話履歴を更新（ユーザーとボットのメッセージを含む）
      setChatHistory([...updatedChatHistory, botMessage]);
    } catch (error) {
      console.error("Google API error:", error);
    }

    setInput("");
  };

  const renderChatMessage = (message: ChatMessage) => {
    if (message.role === "system") {
      // マークダウン形式のメッセージをHTMLに変換して表示
      return <ReactMarkdown>{message.content}</ReactMarkdown>;
    }
    return <div>{message.content}</div>; // 通常のテキストメッセージ
  };

  return (
    <div className={chatContainerStyle}>
      <div className={chatHistoryStyle}>
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={
              chat.role === "user" ? userMessageStyle : botMessageStyle
            }
          >
            {renderChatMessage(chat)}
          </div>
        ))}
      </div>
      <div className={inputAreaStyle}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={inputStyle}
        />
        <button onClick={sendMessage} className={buttonStyle}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
