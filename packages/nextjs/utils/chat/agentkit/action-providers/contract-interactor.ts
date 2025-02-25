import { ActionProvider, EvmWalletProvider, Network, CreateAction, WalletProvider } from "@coinbase/agentkit";
import { z } from "zod";
import deployedContracts from "~~/contracts/deployedContracts";
import { Hex } from "viem";
import { encodeFunctionData } from "viem";
class ContractInteractor extends ActionProvider<WalletProvider> {
    private chainId: keyof typeof deployedContracts;

    private static readonly SCHEMA = z.object({
        contractName: z.string(),
        functionName: z.string().describe("The name of the function to call"),
        functionArgs: z.array(z.string().or(z.boolean())).describe("The arguments to pass to the function"),
        value: z.string().optional().describe("The value to send with the transaction, in wei"),
    });

    constructor(chainId: keyof typeof deployedContracts) {
        super("contract-interactor", []);
        this.chainId = chainId;
    }

    private validateContract(args: z.infer<typeof ContractInteractor.SCHEMA>) {
        if (!Object.keys(deployedContracts[this.chainId]).includes(args.contractName)) {
            return {
                ...args,
                error: `Invalid contract name. Available: ${Object.keys(deployedContracts[this.chainId]).join(", ")}`
            };
        }
        const contract = deployedContracts[this.chainId][args.contractName as keyof typeof deployedContracts[keyof typeof deployedContracts]];
        if (!contract) {
            return {
                ...args,
                error: "Contract not found"
            };
        }
        return contract;
    }

    @CreateAction({
        name: "read-contract",
        description: "Call a read-only function on a contract (where the mutabilityState is 'view' or 'pure').",
        schema: ContractInteractor.SCHEMA,
    })
    async readContract(walletProvider: EvmWalletProvider, args: z.infer<typeof ContractInteractor.SCHEMA>) {
        try {
            const contract = this.validateContract(args);
            if ('error' in contract) return contract.error;

            const result = await walletProvider.readContract({
                address: contract.address,
                abi: contract.abi,
                functionName: args.functionName,
                args: args.functionArgs,
            });

            return { ...args, result: String(result) };
        } catch (error) {
            return { ...args, error: String(error) };
        }
    }

    @CreateAction({
        name: "write-contract",
        description: "Call a write function on a contract. Confirm with the user before sending.",
        schema: ContractInteractor.SCHEMA,
    })
    async writeContract(walletProvider: EvmWalletProvider, args: z.infer<typeof ContractInteractor.SCHEMA>) {
        try {
            const contract = this.validateContract(args);
            if ('error' in contract) return contract;

            const hash = await walletProvider.sendTransaction({
                to: contract.address as Hex,
                data: encodeFunctionData({
                    abi: contract.abi,
                    functionName: args.functionName as keyof typeof contract.abi.entries,
                    args: args.functionArgs,
                }),
                value: args.value ? BigInt(args.value) : undefined,
            });

            return { ...args, hash };
        } catch (error) {
            return { ...args, error: String(error) };
        }
    }

    // eslint-disable-next-line
    supportsNetwork = (network: Network) => network.chainId === String(this.chainId);
}

export const contractInteractor = (chainId: keyof typeof deployedContracts) => new ContractInteractor(chainId);