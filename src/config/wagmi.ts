import { createConfig, http } from 'wagmi';
import { polygon } from 'wagmi/chains';
import { metaMask } from 'wagmi/connectors';
import { RPC_URL } from '../constants';

export const config = createConfig({
  chains: [polygon],
  connectors: [metaMask()],
  transports: {
    [polygon.id]: http(RPC_URL),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
