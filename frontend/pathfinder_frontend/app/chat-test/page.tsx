"use client";

import ChatbotPopup from "@/components/ChatbotPopup";

export default function ChatTestPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-transparent p-4 font-sans">
      <div className="max-w-2xl text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          Chatbot UI Test Room 🧪
        </h1>
        <p className="mb-8 text-lg text-gray-600">
          This is an isolated test page to verify the **PathFinder+ AI
          Assistant**. Look at the bottom right corner to find the magic! ✨
        </p>
      </div>

      {/* The Component We are Testing */}
      <ChatbotPopup />
    </div>
  );
}
