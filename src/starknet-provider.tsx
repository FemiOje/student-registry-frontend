import { ReactNode, useState, useEffect } from "react";
import { InjectedConnector } from "starknetkit/injected";
import { ArgentMobileConnector, isInArgentMobileAppBrowser } from "starknetkit/argentMobile";
import { WebWalletConnector } from "starknetkit/webwallet";
import { sepolia } from "@starknet-react/chains";
import { StarknetConfig, publicProvider } from "@starknet-react/core";
import { connect, disconnect } from "starknetkit";
import { StarknetWindowObject } from "starknetkit";
// import { availableConnectors } from './helpers/connectors';
 
interface StarknetProviderProps {
  children: ReactNode;
}

export default function StarknetProvider({ children }: StarknetProviderProps) {
  const chains = [sepolia];
  const [wallet, setWallet] = useState<StarknetWindowObject | null | undefined>();

  const connectors = isInArgentMobileAppBrowser() ? [
    ArgentMobileConnector.init({
      options: {
        dappName: "Example dapp",
        projectId: "example-project-id",
        url: window.location.hostname
      },
      inAppBrowserOptions: {},
    })
  ] : [
    new InjectedConnector({ options: { id: "braavos", name: "Braavos" }}),
    new InjectedConnector({ options: { id: "argentX", name: "Argent X" }}),
    new WebWalletConnector({ url: "https://web.argent.xyz" }),
    ArgentMobileConnector.init({
      options: {
        dappName: "Example dapp",
        projectId: "example-project-id",
        url: window.location.hostname
      }
    })
  ];

  useEffect(() => {
    const autoConnect = async () => {
      try {
        const { wallet: connectedWallet } = await connect({
          // provider,
          modalMode: "alwaysAsk",
          webWalletUrl: import.meta.env.VITE_ARGENT_WEBWALLET_URL,
          argentMobileOptions: {
            dappName: "Student Registry",
            url: window.location.hostname,
            chainId: import.meta.env.VITE_CHAIN_ID,
            icons: [],
          },
        })
        setWallet(connectedWallet);
      } catch (e) {
        console.error(e);
        alert((e as any).message);
      }
    }

    if (!wallet) {
      autoConnect();
    }
  }, [wallet])

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.addEventListener("wallet_disconnected", async () => {
        setWallet(null)
      })
    }
  }, [])
 
  return(
    <StarknetConfig
      chains={chains}
      provider={publicProvider()}
      connectors={connectors}
    >
      {children}
    </StarknetConfig>
  )
}