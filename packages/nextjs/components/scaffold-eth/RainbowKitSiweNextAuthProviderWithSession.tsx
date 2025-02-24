"use client";

import { ReactNode } from "react";
import { GetSiweMessageOptions, RainbowKitSiweNextAuthProvider } from "@rainbow-me/rainbowkit-siwe-next-auth";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

interface RainbowKitSiweNextAuthProviderWithSessionProps {
  // RainbowKitSiweNextAuthProvider props
  enabled?: boolean;
  getSiweMessageOptions?: GetSiweMessageOptions;

  // SessionProvider props
  session?: Session | null;
  refetchInterval?: number;
  refetchOnWindowFocus?: boolean;

  children: ReactNode;
}

/**
 * Combines SessionProvider and RainbowKitSiweNextAuthProvider into a single component
 * This is useful for Next.js 13+ apps using SIWE (Sign-In with Ethereum) with RainbowKit
 */
export const RainbowKitSiweNextAuthProviderWithSession = ({
  // RainbowKit SIWE props
  enabled,
  getSiweMessageOptions,
  // Session props
  session,
  refetchInterval,
  refetchOnWindowFocus,
  // Common props
  children,
}: RainbowKitSiweNextAuthProviderWithSessionProps) => {
  return (
    <SessionProvider session={session} refetchInterval={refetchInterval} refetchOnWindowFocus={refetchOnWindowFocus}>
      <RainbowKitSiweNextAuthProvider enabled={enabled} getSiweMessageOptions={getSiweMessageOptions}>
        {children}
      </RainbowKitSiweNextAuthProvider>
    </SessionProvider>
  );
};
