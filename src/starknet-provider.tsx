import { ReactNode, useState, createContext } from "react";
import { sepolia } from "@starknet-react/chains";
import { StarknetConfig, publicProvider, voyager } from "@starknet-react/core";
import { ConnectorData } from "starknetkit";
import { StarknetWindowObject } from "starknetkit";
import { availableConnectors } from "./helpers/connectors";
// import { connectors } from "./helpers/connectors";

interface WalletContextType {
  wallet: StarknetWindowObject | null | undefined;
  setWallet: (wallet: StarknetWindowObject | null | undefined) => void;
  connectorData: ConnectorData | null;
  setConnectorData: (connectorData: ConnectorData | null) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface StarknetProviderProps {
  children: ReactNode;
}



 
function StarknetProvider({ children }: StarknetProviderProps) {
  const chains = [sepolia];
  const provider = publicProvider();
  const [wallet, setWallet] = useState<StarknetWindowObject | null | undefined>(null);
  const [connectorData, setConnectorData] = useState<ConnectorData | null>(null);

  return (
    <WalletContext.Provider value={{ wallet, setWallet, connectorData, setConnectorData }}>
      <StarknetConfig 
      chains={chains} 
      provider={provider} 
      connectors={availableConnectors} 
      explorer={voyager}>
        {children}
      </StarknetConfig>
    </WalletContext.Provider>
  );
}

export { WalletContext, StarknetProvider };
