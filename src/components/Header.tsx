import { useStarknetkitConnectModal, StarknetkitConnector } from "starknetkit";
import { useState } from "react";
// import { WalletContext } from "../starknet-provider";
import { useAccount, useConnect, useDisconnect, Connector } from "@starknet-react/core";
import { availableConnectors } from "../helpers/connectors";
import toast from "react-hot-toast";

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { disconnect } = useDisconnect({});
  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: availableConnectors as StarknetkitConnector[],
  });
  const { connect } = useConnect();
  
  const { address } = useAccount();

  async function connectWalletWithModal() {
    try {
      const { connector } = await starknetkitConnectModal();
  
      if (!connector) {
        toast.error("No wallet selected.");
        return;
      }
  
      await connect({ connector: connector as Connector });  
      toast.success("Connected successfully");
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet. Please try again.");
    }
  }

  const disconnectWallet = async () => {
    try {
      await disconnect();
      toast.success("Disconnected successfully");
    } catch (error) {
      toast.error("Error occurred." + error + " Please try again.");
    }
  };

  return (
    <nav className="flex items-center justify-between sticky top-0 shadow-lg p-5 bg-white">
      <div className="title text-xl font-semibold">Student Registry</div>
      <div className="wallet-status ml-auto relative">
        {address ? (
          <div className="flex items-center">
            <p className="text-black bg-gray-200 rounded-full px-5 py-1">
              {address?.slice(0, 6)}...
              {address?.slice(-4)}
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
                  onClick={() => disconnectWallet()}
                  className="w-full px-4 py-2 text-center text-red-600 hover:bg-red-100"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            className="bg-blue-700 text-white rounded-full px-4 py-2 hover:bg-blue-600 transition"
            onClick={() => connectWalletWithModal()}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
}
