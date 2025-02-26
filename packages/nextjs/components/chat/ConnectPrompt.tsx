import { CustomConnectButton } from "./CustomConnectButton";

interface ConnectPromptProps {
  address?: string;
  sessionAddress?: string;
}

export const ConnectPrompt = ({ address, sessionAddress }: ConnectPromptProps) => {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto h-[600px] my-8 relative bg-white dark:bg-zinc-900 rounded-lg shadow-xl">
      <div className="text-center space-y-4">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 px-8">
          {address && sessionAddress && address.toLowerCase() !== sessionAddress.toLowerCase()
            ? "Connected wallet doesn't match authenticated session"
            : "Please sign in to start chatting with the AI assistant"}
        </p>
        <div className="mt-4">
          <CustomConnectButton />
        </div>
      </div>
    </div>
  );
};
