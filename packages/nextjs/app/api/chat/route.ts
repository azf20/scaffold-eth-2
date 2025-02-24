import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { getServerSession } from "next-auth";
import { foundry } from "viem/chains";
import { getPrompt } from "~~/utils/chat";
import { siweAuthOptions } from "~~/utils/scaffold-eth/auth";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const session = (await getServerSession(siweAuthOptions({ chain: foundry }))) as any;
  const userAddress = session?.user?.address;

  if (!userAddress) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages } = await req.json();
  const { systemPrompt, tools } = await getPrompt({ userAddress, chain: foundry });

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    system: systemPrompt,
    tools,
  });

  return result.toDataStreamResponse();
}
