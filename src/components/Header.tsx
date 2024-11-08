import { connect, disconnect } from "starknetkit";
import { useContext, useState } from "react";
import { WalletContext } from "../starknet-provider";
import toast from "react-hot-toast";

export default function Header() {
  const walletContext = useContext(WalletContext);
  if (!walletContext) {
    throw new Error("Header must be used within a StarknetProvider");
  }
  const { wallet, setWallet, connectorData, setConnectorData } = walletContext;

  const [dropdownOpen, setDropdownOpen] = useState(false);

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

      if (connectorData !== null) {
        toast.success("Connected successfully");
      }
    } catch (e) {
      console.error(e);
      toast.error((e as any).message);
    }
  };

  const disconnectWallet = async () => {
    try {
      await disconnect();
      setWallet(null);
      setConnectorData(null);
      setDropdownOpen(false);
      toast.success("Wallet disconnected");
    } catch (error) {
      toast.error("Error occured. Please try again.");
    }
  };

  return (
    <nav className="flex items-center justify-between sticky top-0 shadow-lg p-5 bg-white">
      <div className="title text-xl font-semibold">Student Registry</div>
      <div className="wallet-status ml-auto relative">
        {wallet ? (
          <div className="flex items-center">
            <p className="text-black bg-gray-200 rounded-full px-5 py-1">
              connected: {connectorData?.account?.slice(0, 6)}...{connectorData?.account?.slice(-4)}
            </p>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="ml-2 text-lg"
            >
              ▼
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-20 w-32 bg-white border rounded shadow-lg">
                <button
                  onClick={disconnectWallet}
                  className="w-full px-4 py-2 text-center bg-red-600 text-white rounded-lg hover:bg-red-100"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
}
