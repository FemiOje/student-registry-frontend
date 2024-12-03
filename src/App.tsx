import { useState, useEffect } from "react";
import { StarknetProvider } from '../src/starknet-provider';
import { argent, braavos, Connector, useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { Toaster } from 'react-hot-toast';
import toast from "react-hot-toast";
import Table from '../src/components/Table';
import Header from '../src/components/Header';


function App() {
  const { connectAsync } = useConnect({});

  const { address } = useAccount();
  
  const { disconnect } = useDisconnect();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsModalOpen(true);

    return () => {
      setIsModalOpen(false);
    }
  }, []);



  const connectWalletWithModal = async (connector: Connector) => {
    try {
      await connectAsync({ connector: connector });
      toast.success("Wallet connected");
      setIsModalOpen(false);
    } catch (error) {
      toast.error(`Error occurred: ${error}`);
    }
  }

  const disconnectWallet = async () => {
    try {
      await disconnect();
      toast.success("Wallet disconnected");
    } catch (error) {
      toast.error(`Error occurred: ${error}`);
    }
  };

  return (
    <>
      <StarknetProvider >
        <Toaster />
        <Header
          address={address}
          openModal={() => setIsModalOpen(true)}
          disconnectWallet={() => disconnectWallet()}
        />
        <Table />

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h2 className="text-lg font-semibold mb-4">Select Wallet</h2>
              <button
                onClick={() => connectWalletWithModal(argent())}
                className="w-full mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Connect with Argent
              </button>
              <button
                onClick={() => connectWalletWithModal(braavos())}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Connect with Braavos
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="mt-4 w-full px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </StarknetProvider>
    </>
  )
};

export default App;
