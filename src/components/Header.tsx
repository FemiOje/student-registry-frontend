// Header.tsx
import { connect } from "starknetkit";
import { useContext } from "react";
import { WalletContext } from "../starknet-provider";
import toast from 'react-hot-toast';


export default function Header() {
  const walletContext = useContext(WalletContext);
  if (!walletContext) {
    throw new Error("Header must be used within a StarknetProvider");
  }
  const {
    wallet,
    setWallet,
    connectorData,
    setConnectorData 
  } = walletContext;


  
  const connectWallet = async () => {
    try {
      const { wallet: connectedWallet, connectorData } = await connect({
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
      setConnectorData(connectorData);
    } catch (e) {
      console.error(e);
      toast.error((e as any).message);
    }
  };
  

  return (
    <nav className="flex items-center justify-between sticky top-0 shadow-lg p-5 bg-white">
      <div className="title text-xl font-semibold">Student Registry</div>
      <div className="wallet-status ml-auto">
        {wallet ? (
          <div className="flex ">
            <p className="text-black bg-gray-200 rounded-full px-5 py-1">
              connected: {connectorData?.account}
            </p>
            <p>v</p>
          </div>
        ) : (
          <button
            className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition"
            onClick={() => connectWallet()}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
}
