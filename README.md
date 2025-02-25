# 🏗 Scaffold-ETH 2 / chat extension

## Install

```bash
git clone -b agent-chat-extension https://github.com/azf20/scaffold-eth-2
yarn install
yarn chain # in one terminal
yarn deploy # in another terminal
cp .env.example packages/nextjs/.env.local
yarn start # in another terminal
```

.env:
```
AGENT_PRIVATE_KEY= # agent private key, don't use the example key in .env.example in production!
OPENAI_API_KEY= # openai api key
NEXTAUTH_SECRET= # random string
```

Go to http://localhost:3000/chat and chat to your agent! Ask for its address, and send it some ETH from the scaffold-eth Faucet.

Update the prompt in `packages/nextjs/utils/chat/index.ts` to change the agent's behavior.

Add new tools in `packages/nextjs/utils/chat/tools.ts`