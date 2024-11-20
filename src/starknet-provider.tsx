import { ReactNode } from "react";
import { sepolia } from "@starknet-react/chains";
import { StarknetConfig, publicProvider, voyager } from "@starknet-react/core";
import { availableConnectors } from "./helpers/connectors";

interface StarknetProviderProps {
  children: ReactNode;
}

function StarknetProvider({ children }: StarknetProviderProps) {
  const chains = [sepolia];
  const provider = publicProvider();

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
