"use client";

import { useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { useSession } from "next-auth/react";
import { useAccount } from "wagmi";
import { ChatInput } from "~~/components/chat/ChatInput";
import { ConnectPrompt } from "~~/components/chat/ConnectPrompt";
import { MessageList } from "~~/components/chat/MessageList";
import { clearMessages, loadMessages, saveMessages } from "~~/utils/chat/storage";

// Extend Session type inline
declare module "next-auth" {
  interface Session {
    address?: string;
  }
}

export default function Chat() {
  const {
    messages,
    setMessages,
    input,
    handleInputChange,
    handleSubmit,
    status: chatStatus,
    stop,
  } = useChat({
    maxSteps: 10,
  });
  const { data: session, status: sessionStatus } = useSession();
  const { address } = useAccount();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageCount = useRef(messages.length);

  // Check if session exists and matches connected wallet
  const isAuthenticated = session?.address && address && session.address.toLowerCase() === address.toLowerCase();

  // Load messages on mount
  useEffect(() => {
    loadMessages().then(storedMessages => {
      if (storedMessages.length > 0) {
        setMessages(storedMessages);
      }
    });
  }, [setMessages]);

  // Save messages when they change
  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  useEffect(() => {
    if (messages.length > lastMessageCount.current && messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
      lastMessageCount.current = messages.length;
    }
  }, [messages]);

  const handleClearChat = async () => {
    await clearMessages();
    setMessages([]);
  };

  // Loading state
  if (sessionStatus === "loading") {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto h-[600px] my-8 relative bg-white dark:bg-zinc-900 rounded-lg shadow-xl">
        <div className="text-zinc-600 dark:text-zinc-400">Loading...</div>
      </div>
    );
  }

  // Render content based on authentication state
  if (!isAuthenticated) {
    return <ConnectPrompt address={address} sessionAddress={session?.address} />;
  }

  return (
    <div className="flex flex-col w-full max-w-md mx-auto h-[600px] my-8 relative bg-white dark:bg-zinc-900 rounded-lg shadow-xl">
      <div className="absolute top-2 left-2">
        <button
          onClick={handleClearChat}
          className="px-2 py-1 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 
            border border-zinc-200 dark:border-zinc-700 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          Clear Chat
        </button>
      </div>

      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4">
        <MessageList messages={messages} status={chatStatus} onStop={stop} />
      </div>
      <ChatInput input={input} status={chatStatus} onSubmit={handleSubmit} onChange={handleInputChange} />
    </div>
  );
}
