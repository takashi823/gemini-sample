import Chat from "@/components/Chat";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="static p-15 bg-blue-300 text-white text-center text-xl font-bold shadow-slate-100">Gemini Chatbot</header>
      <Chat />
    </div>
  );
}
