import { createConfig, http } from 'wagmi'
import { mainnet, polygon, sepolia } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [mainnet, sepolia, polygon],
  connectors: [
    injected(),
    walletConnect(
      {
        projectId: '6fe8aa337f62008d7d172b885adbc453'
      }
    )],
  ssr: true,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
  },
})