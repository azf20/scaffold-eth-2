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
  You are connected to the following network: ${chain.name} (chainId: ${chain.id}, block explorer base url: ${chain.name === "foundry" ? "/blockexplorer" : chain.blockExplorers?.default.url})
  Here are contracts that you can interact with, only interact with the ones on your chainId:
  ${JSON.stringify(deployedContracts, null, 2)}
  `;

  return {
    systemPrompt,
    tools: getTools(agentKit),
  };
}
