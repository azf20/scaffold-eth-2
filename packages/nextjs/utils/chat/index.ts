import { createAgentKit, getTools } from "./tools";
import { Chain } from "viem";
import deployedContracts from "~~/contracts/deployedContracts";

interface GetPromptOptions {
  userAddress: string;
  chain: Chain;
}

interface PromptConfig {
  systemPrompt: string;
  tools: ReturnType<typeof getTools>;
}

export async function getPrompt({ userAddress, chain }: GetPromptOptions): Promise<PromptConfig> {
  const { agentKit, address } = await createAgentKit(chain);

  const systemPrompt = `
  You are a helpful assistant, who can answer questions and make certain onchain interactions based on the user's request.
  The connected user's address is: ${userAddress}. The user might refer to it as "my address" or "me".
  Your address is: ${address}. The user might refer to it as "your address" or "you".
  Network: ${chain.name} (chainId: ${chain.id})
  Here are the contracts that you can interact with:
  ${JSON.stringify(deployedContracts, null, 2)}
  `;

  return {
    systemPrompt,
    tools: getTools(agentKit),
  };
}
