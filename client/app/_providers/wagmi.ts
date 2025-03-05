"use client";

import { createConfig } from "@privy-io/wagmi";
import { sepolia, mainnet, baseSepolia, polygonAmoy, arbitrumSepolia, sonicTestnet } from "wagmi/chains";
import { coinbaseWallet } from 'wagmi/connectors';
import { Chain } from "wagmi/chains";
import { http, createStorage, cookieStorage } from "wagmi"

export const sonicBlaze = {
  id: 57054,
  name: "Sonic Blaze Testnet",
  rpcUrls: {
    default: { http: ["https://rpc.blaze.soniclabs.com"] },
  },
  nativeCurrency: {
    decimals: 18,
    name: 'Sonic',
    symbol: 'S',
  },
  testnet: true,

  blockExplorers: {
    default: {
      name: "Sonic Testnet Explorer",
      url: "https://testnet.sonicscan.org",
      apiUrl: "https://api-testnet.sonicscan.org/api",
    },
  },
} as const satisfies Chain;

const chains: readonly [Chain, ...Chain[]] = [
  sonicBlaze,
];

export const config = createConfig({
  chains,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [sonicBlaze.id]: http(),
  },
  ssr: false,
});
