import { ReactNode, useState, useEffect, createContext } from "react";
import { sepolia } from "@starknet-react/chains";
import { StarknetConfig, publicProvider } from "@starknet-react/core";
import { connect, ConnectorData } from "starknetkit";
import { StarknetWindowObject } from "starknetkit";
import { connectors } from "./helpers/connectors";
import { toast } from "react-hot-toast";

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
  const [wallet, setWallet] = useState<StarknetWindowObject | null | undefined>();
  const [connectorData, setConnectorData] = useState<ConnectorData | null>(null);


  useEffect(() => {
    const autoConnect = async () => {
      try {
        const { wallet: connectedWallet, connectorData, connector } = await connect({
          modalMode: "alwaysAsk",
          webWalletUrl: import.meta.env.VITE_ARGENT_WEBWALLET_URL,
          argentMobileOptions: {
            dappName: "Student Registry",
            url: window.location.hostname,
            chainId: import.meta.env.VITE_CHAIN_ID,
            icons: [],
          },
        });
        setWallet(connectedWallet);
        setConnectorData(connectorData)
      } catch (e) {
        console.error(e);
        toast.error((e as any).message);
      }
    };

    if (!wallet) {
      autoConnect();
    }
  }, []);

  // handle disconnect properly
  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     document.addEventListener("wallet_disconnected", async () => {
  //       setWallet(null);
  //     });
  //   }
  // }, []);

  return (
    <WalletContext.Provider value={
      {
        wallet,
        setWallet,
        connectorData: connectorData,
        setConnectorData: setConnectorData
      }
    }>
      <StarknetConfig chains={chains} provider={publicProvider()} connectors={connectors}>
        {children}
      </StarknetConfig>
    </WalletContext.Provider>
  );
}
