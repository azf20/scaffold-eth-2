import { UIMessage } from "ai";
import { get, set } from "idb-keyval";

const CHAT_STORAGE_KEY = "scaffold-eth-chat-history";

export async function saveMessages(messages: UIMessage[]) {
  await set(CHAT_STORAGE_KEY, messages);
}

export async function loadMessages(): Promise<UIMessage[]> {
  return (await get(CHAT_STORAGE_KEY)) || [];
}

export async function clearMessages() {
  await set(CHAT_STORAGE_KEY, []);
}
