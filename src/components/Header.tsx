import { connect, disconnect } from "starknetkit";
import { useContext, useState, useMemo, useEffect } from "react";
import { WalletContext } from "../starknet-provider";
import toast from "react-hot-toast";

export default function Header() {
  const walletContext = useContext(WalletContext);
  if (!walletContext) {
    throw new Error("Header must be used within a StarknetProvider");
  }
  const { wallet, setWallet, connectorData, setConnectorData } = walletContext;

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const parseBigInt = (value: any) => {
    return typeof value === "string" && /^\d+n$/.test(value)
      ? BigInt(value.slice(0, -1))
      : value;
  };
  
  const savedConnectionData = useMemo(() => {
    const savedWallet = localStorage.getItem("wallet");
    const savedConnectorData = localStorage.getItem("connectorData");
    return {
      wallet: savedWallet ? JSON.parse(savedWallet, parseBigInt) : null,
      connectorData: savedConnectorData ? JSON.parse(savedConnectorData, parseBigInt) : null,
    };
  }, []);

  useEffect(() => {
    if (savedConnectionData.wallet && savedConnectionData.connectorData) {

      setWallet(savedConnectionData.wallet);
      setConnectorData(savedConnectionData.connectorData);
      toast.success("Reconnected successfully");
    }
  }, [savedConnectionData, setWallet, setConnectorData]);

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

      if (connectorData) {
        localStorage.setItem(
          "wallet",
          JSON.stringify(connectedWallet, (_, value) =>
            typeof value === "bigint" ? value.toString() : value
          )
        );
        localStorage.setItem(
          "connectorData",
          JSON.stringify(connectorData, (_, value) =>
            typeof value === "bigint" ? value.toString() : value
          )
        );
        toast.success("Connected successfully");
      }
    } catch (e) {
      console.error(e);
      toast.error((e as any).message || "Failed to connect.");
    }
  };

  const disconnectWallet = async () => {
    try {
      await disconnect();
      setWallet(null);
      setConnectorData(null);
      setDropdownOpen(false);
      localStorage.removeItem("wallet");
      localStorage.removeItem("connectorData");
      toast.success("Disconnected successfully");
    } catch (error) {
      toast.error("Error occurred. Please try again.");
    }
  };

  return (
    <nav className="flex items-center justify-between sticky top-0 shadow-lg p-5 bg-white">
      <div className="title text-xl font-semibold">Student Registry</div>
      <div className="wallet-status ml-auto relative">
        {wallet ? (
          <div className="flex items-center">
            <p className="text-black bg-gray-200 rounded-full px-5 py-1">
              {connectorData?.account?.slice(0, 6)}...
              {connectorData?.account?.slice(-4)}
            </p>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="ml-2 text-lg focus:outline-none"
            >
              ▼
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
                <button
                  onClick={disconnectWallet}
                  className="w-full px-4 py-2 text-center text-red-600 hover:bg-red-100"
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
