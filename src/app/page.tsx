import Image from "next/image";

import { css } from "@emotion/css";
import Chat from "@/components/Chat";

const headerStyle = css`
  padding: 15px;
  background-color: #5c6bc0;
  color: white;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

export default function Home() {
  return (
    <div>
      <header className={headerStyle}>Gemini Chatbot</header>
      <Chat />
    </div>
  );
}
