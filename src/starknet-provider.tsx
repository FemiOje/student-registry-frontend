import { ReactNode, useState, createContext } from "react";
import { sepolia } from "@starknet-react/chains";
import { StarknetConfig, publicProvider, voyager } from "@starknet-react/core";
import { ConnectorData } from "starknetkit";
import { StarknetWindowObject } from "starknetkit";
import { connectors } from "./helpers/connectors";

interface WalletContextType {
  wallet: StarknetWindowObject | null | undefined;
  setWallet: (wallet: StarknetWindowObject | null | undefined) => void;
  connectorData: ConnectorData | null;
  setConnectorData: (connectorData: ConnectorData | null) => void;
}

export const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface StarknetProviderProps {
  children: ReactNode;
}

export default function StarknetProvider({ children }: StarknetProviderProps) {
  const chains = [sepolia];
  const [wallet, setWallet] = useState<StarknetWindowObject | null | undefined>(null);
  const [connectorData, setConnectorData] = useState<ConnectorData | null>(null);

  return (
    <WalletContext.Provider value={{ wallet, setWallet, connectorData, setConnectorData }}>
      <StarknetConfig chains={chains} provider={publicProvider()} connectors={connectors} explorer={voyager}>
        {children}
      </StarknetConfig>
    </WalletContext.Provider>
  );
}
