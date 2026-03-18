"use client";
import { useState, useEffect, useRef } from "react";
import { Button, Input, Avatar, Spinner } from "@heroui/react";
import {
  SendIcon,
  PaperclipIcon,
  ChevronLeftIcon,
  FileIcon,
  ImageIcon,
  XIcon,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function MentorChat({
  params,
}: {
  params: { mentorId: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // If URL has ?studentId=, the user is acting as the Mentor talking TO the student. Else, student talking to mentor.
  const isMentorView = searchParams.has("studentId");
  const studentId = searchParams.get("studentId");
  const myId = isMentorView ? "2" : "1"; // 2 = Admin/Mentor Demo, 1 = Student Demo

  // The perspective URL ID for the Chat API. (If we are the Mentor, we fetch the chat with the specific student ID, and vice-versa).
  const chatPartnerId = isMentorView ? studentId : params.mentorId;

  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => scrollToBottom(), [chatHistory]);

  const fetchHistory = async () => {
    try {
      // The backend expects `/chat/history/{mentor_id}` where mentor_id is the shared session ID.
      // In a real app, the backend logic would handle generic /chat/{session} rather than strictly mentor ID.
      // Here, the Mentor ID is the constant session identifier.
      const res = await fetch(
        `http://127.0.0.1:8001/chat/history/${params.mentorId}`,
        {
          headers: { "X-User-Id": myId },
        },
      );
      const data = await res.json();
      if (res.ok) setChatHistory(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 5000); // Polling for new messages
    return () => clearInterval(interval);
  }, [params.mentorId, myId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const uploadAttachment = async (): Promise<string | null> => {
    if (!selectedFile) return null;
    const formData = new FormData();
    formData.append("file", selectedFile);

    setUploading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8001/chat/upload`, {
        method: "POST",
        headers: { "X-User-Id": myId }, // No Content-Type standard for multipart/form-data with fetch
        body: formData,
      });
      const data = await res.json();
      return data.url; // e.g. "/uploads/resume.pdf"
    } catch (e) {
      console.error("Upload failed", e);
      return null;
    } finally {
      setUploading(false);
      setSelectedFile(null);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() && !selectedFile) return;

    setError(null);
    const attachmentUrl = await uploadAttachment();
    const sentMsg = message;
    setMessage("");

    // Optimistically update UI
    setChatHistory((prev) => [
      ...prev,
      {
        sender: isMentorView ? "mentor" : "user",
        message: sentMsg,
        attachment_url: attachmentUrl,
      },
    ]);

    try {
      const res = await fetch(
        `http://127.0.0.1:8001/chat/send/${params.mentorId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-User-Id": myId },
          body: JSON.stringify({
            type: "text",
            content: sentMsg,
            attachment_url: attachmentUrl,
          }),
        },
      );
      if (!res.ok) throw new Error("Failed to send message");
      setTimeout(fetchHistory, 500); // Trigger a refresh to get any AI mock replies
    } catch (e: any) {
      console.error("Failed to send message", e);
      setError("Failed to send your message. Please try again.");
      // Rollback optimistic update
      setChatHistory((prev) => prev.slice(0, -1));
      setMessage(sentMsg);
    }
  };

  // Rendering Document Attachments Interactively
  const renderAttachment = (url: string) => {
    const isImage = url.match(/\.(jpeg|jpg|gif|png|webp)$/i);
    const fileName = url.split("/").pop() || "Attached File";

    if (isImage) {
      return (
        <a
          href={`http://127.0.0.1:8001${url}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={`http://127.0.0.1:8001${url}`}
            alt="Attachment"
            className="max-w-[200px] rounded-lg mt-2 border border-white/20 hover:opacity-90"
          />
        </a>
      );
    }
    return (
      <a
        href={`http://127.0.0.1:8001${url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 mt-2 p-2 bg-black/10 rounded-lg hover:bg-black/20 transition-colors"
      >
        <FileIcon size={16} className="opacity-80" />
        <span className="text-xs font-medium underline underline-offset-2 truncate max-w-[150px]">
          {fileName}
        </span>
      </a>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-[#f3f4f6] font-sans">
      {/* Telegram-Style Header */}
      <div className="bg-content1 px-4 py-3 border-b flex items-center shadow-sm z-10">
        <button
          onClick={() => router.push("/mentors")}
          className="mr-3 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeftIcon size={24} className="text-gray-600" />
        </button>
        <Avatar
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(isMentorView ? "Student" : "Mentor")}&background=random`}
          className="mr-3"
        />
        <div className="flex flex-col flex-1">
          <h2 className="font-semibold text-gray-800 text-lg leading-tight">
            {isMentorView
              ? `Chatting with Student ID: ${studentId}`
              : "Mentorship Chat"}
          </h2>
          <span className="text-xs text-green-500 font-medium tracking-wide">
            ● Online
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-red-500 text-white text-sm py-2 px-4 shadow-md flex justify-between items-center z-20 animate-in slide-in-from-top-2">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="hover:text-red-200">
            <XIcon size={16} />
          </button>
        </div>
      )}

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner color="primary" />
          </div>
        ) : chatHistory.length === 0 ? (
          <div className="flex justify-center items-center h-full text-center text-gray-400 bg-content1/50 backdrop-blur-sm rounded-2xl mx-auto max-w-sm p-8 border border-gray-100">
            Send a message to start the connection!
          </div>
        ) : (
          chatHistory.map((msg, idx) => {
            const isMe =
              (isMentorView && msg.sender === "mentor") ||
              (!isMentorView && msg.sender === "user");
            return (
              <div
                key={idx}
                className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex flex-col max-w-[80%] sm:max-w-[60%] ${isMe ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`p-4 rounded-2xl shadow-sm relative ${
                      isMe
                        ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-tr-sm"
                        : " bg-content1 text-gray-800 rounded-tl-sm border border-gray-100"
                    }`}
                  >
                    {msg.message && (
                      <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                        {msg.message}
                      </p>
                    )}
                    {msg.attachment_url && renderAttachment(msg.attachment_url)}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Attachment Preview Overlay */}
      {selectedFile && (
        <div className="px-4 py-2 bg-gray-100 border-t flex justify-between items-center text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            {selectedFile.type.startsWith("image/") ? (
              <ImageIcon size={16} />
            ) : (
              <FileIcon size={16} />
            )}
            <span className="font-medium truncate max-w-[200px]">
              {selectedFile.name}
            </span>
            <span className="text-xs text-gray-400">
              ({(selectedFile.size / 1024).toFixed(1)} KB)
            </span>
          </div>
          <button
            onClick={() => setSelectedFile(null)}
            className="p-1 hover:bg-gray-200 rounded-full text-gray-500"
          >
            <XIcon size={16} />
          </button>
        </div>
      )}

      {/* Input Composer */}
      <div className="bg-content1 p-4 border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <form
          className="max-w-4xl mx-auto flex items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors flex-shrink-0"
            title="Attach a file"
          >
            <PaperclipIcon size={20} />
          </button>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />

          <Input
            classNames={{
              inputWrapper:
                "bg-gray-100 border-transparent focus-within:ring-2 focus-within:ring-purple-500/30 rounded-2xl min-h-[48px]",
              input: "text-[15px]",
            }}
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={uploading}
            className="flex-1"
          />

          <Button
            isIconOnly
            color="primary"
            size="lg"
            type="submit"
            radius="full"
            className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md shadow-purple-500/20"
            isDisabled={uploading || (!message.trim() && !selectedFile)}
            isLoading={uploading}
          >
            <SendIcon
              size={18}
              className="translate-x-[1px] translate-y-[1px]"
            />
          </Button>
        </form>
      </div>
    </div>
  );
}
