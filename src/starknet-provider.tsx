import { ReactNode } from "react";
import { sepolia } from "@starknet-react/chains";
import { StarknetConfig, publicProvider, voyager } from "@starknet-react/core";
import { useInjectedConnectors, argent, braavos } from "@starknet-react/core";


interface StarknetProviderProps {
  children: ReactNode;
}

function StarknetProvider({ children }: StarknetProviderProps) {
  const chains = [sepolia];
  const provider = publicProvider();
  const { connectors: availableConnectors } = useInjectedConnectors({
    recommended: [argent(), braavos()],
    includeRecommended: "always",
    order: "alphabetical",
  });

  return (
    <StarknetConfig
      chains={chains}
      provider={provider}
      connectors={availableConnectors}
      explorer={voyager}>
      {children}
    </StarknetConfig>
  );
}

export { StarknetProvider };
