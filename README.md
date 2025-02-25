# 🏗 Scaffold-ETH 2 / chat extension

```bash
yarn install
yarn chain # in one terminal
yarn deploy # in another terminal
yarn dev # in another terminal
```

Go to http://localhost:3000/chat and chat to your agent!

Update the prompt in `packages/nextjs/utils/chat/index.ts` to change the agent's behavior.

Add new tools in `packages/nextjs/utils/chat/tools.ts`

.env:
```
NEXT_PUBLIC_ALCHEMY_API_KEY=
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=
AGENT_PRIVATE_KEY=
OPENAI_API_KEY=
NEXTAUTH_SECRET=
```