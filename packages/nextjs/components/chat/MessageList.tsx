import { MessageToolCalls } from "./MessageToolCalls";
import { StatusIndicator } from "./StatusIndicator";
import { UIMessage } from "ai";
import ReactMarkdown from "react-markdown";

interface MessageListProps {
  messages: UIMessage[];
  status: string;
  onStop: () => void;
}

export const MessageList = ({ messages, status, onStop }: MessageListProps) => {
  const renderMessage = (m: UIMessage) => {
    if (!m.parts) {
      return <ReactMarkdown>{m.content}</ReactMarkdown>;
    }

    const textParts = m.parts.filter(p => p.type === "text");
    const toolParts = m.parts.filter(p => p.type === "tool-invocation");

    return (
      <>
        {textParts.map((part, index) => (
          <div key={`text-${index}`} className="mx-4 break-words whitespace-pre-wrap">
            <ReactMarkdown
              components={{
                code: ({ ...props }) => <code className="break-all font-mono text-sm" {...props} />,
                p: ({ ...props }) => <p className="break-words" {...props} />,
              }}
            >
              {part.text}
            </ReactMarkdown>
          </div>
        ))}
        <MessageToolCalls toolParts={toolParts} messageId={m.id} />
      </>
    );
  };

  return (
    <div className="space-y-2 py-4">
      {messages.map(m => (
        <div key={m.id} className={`flex ${m.role === "user" ? "justify-end ml-8" : "justify-start mr-8"}`}>
          <div
            className={`flex flex-col rounded-lg w-fit max-w-[90%] ${
              m.role === "user" ? "bg-blue-100 dark:bg-blue-900/30" : "bg-zinc-100 dark:bg-zinc-800/50"
            }`}
          >
            {renderMessage(m)}
          </div>
        </div>
      ))}
      <StatusIndicator status={status} onStop={onStop} />
    </div>
  );
};
