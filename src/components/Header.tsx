// import { useStarknetkitConnectModal, StarknetkitConnector } from "starknetkit";
// import { useState, useEffect } from "react";
// import { useAccount, useConnect, useDisconnect, Connector } from "@starknet-react/core";
// import { availableConnectors } from "../helpers/connectors";
// import toast from "react-hot-toast";

// export default function Header() {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const { address } = useAccount();
//   const { connect } = useConnect();

//   useEffect(() => {
//     const storedConnector = sessionStorage.getItem("connector");
//     if (storedConnector && !address) {
//       const parsedConnector = JSON.parse(storedConnector);
//       const connectorInstance = availableConnectors.find(
//         (c) => c.id === parsedConnector.id
//       ) as Connector;

//       if (connectorInstance) {
//         try {
//           connect({ connector: connectorInstance });          
//         } catch (error) {
//           console.error("Reconnect failed:", error);
//           sessionStorage.removeItem("connector");
//         }
//       }
//     }
//   }, [address, connect]);
  
//   const { disconnect } = useDisconnect({});
//   const { starknetkitConnectModal } = useStarknetkitConnectModal({
//     connectors: availableConnectors as StarknetkitConnector[],
//   });

//   async function connectWalletWithModal() {
//     try {
//       const { connector } = await starknetkitConnectModal();

//       if (!connector) {
//         toast.error("No wallet selected.");
//         return;
//       }

//       await connect({ connector: connector as Connector });
//       toast.success("Connected successfully");

//       sessionStorage.setItem("connector", JSON.stringify({ id: connector.id }));
//     } catch (error) {
//       toast.error("Error occurred. " + error + " Please try again.");
//     }
//   }

//   const disconnectWallet = async () => {
//     try {
//       setDropdownOpen(false);
//       await disconnect();
//       sessionStorage.removeItem("connector");
//       toast.success("Wallet disconnected");
//     } catch (error) {
//       toast.error("Error occurred." + error + " Please try again.");
//     }
//   };

//   return (
//     <nav className="flex items-center justify-between sticky top-0 shadow-lg p-5 bg-white">
//       <div className="title text-xl font-semibold">Student Registry</div>
//       <div className="wallet-status ml-auto relative">
//         {address ? (
//           <div className="flex items-center">
//             <p className="text-black bg-gray-200 rounded-full px-5 py-1">
//               {address?.slice(0, 6)}...
//               {address?.slice(-4)}
//             </p>
//             <button
//               onClick={() => setDropdownOpen((prev) => !prev)}
//               className="ml-2 text-lg focus:outline-none"
//             >
//               ▼
//             </button>
//             {dropdownOpen && (
//               <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
//                 <button
//                   onClick={() => disconnectWallet()}
//                   className="w-full px-4 py-5 text-center text-red-600 hover:bg-red-100"
//                 >
//                   Disconnect
//                 </button>
//               </div>
//             )}
//           </div>
//         ) : (
//           <button
//             className="bg-blue-700 text-white rounded-full px-4 py-2 hover:bg-blue-600 transition"
//             onClick={() => connectWalletWithModal()}
//           >
//             Connect Wallet
//           </button>
//         )}
//       </div>
//     </nav>
//   );
// }


import { useStarknetkitConnectModal, StarknetkitConnector } from "starknetkit";
import { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect, Connector } from "@starknet-react/core";
import { availableConnectors } from "../helpers/connectors";
import toast from "react-hot-toast";

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { address } = useAccount();
  const { connect, connectors } = useConnect();
  
  const { disconnect } = useDisconnect({});
  
  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: availableConnectors as StarknetkitConnector[],
  });

  useEffect(() => {
    const storedConnector = sessionStorage.getItem("connector");
    if (storedConnector && !address) {
      try {
        const parsedConnector = JSON.parse(storedConnector);
    
        const matchingConnector = connectors.find(
          (c) => c.id === parsedConnector.id
        );

        if (matchingConnector) {
          connect({ connector: matchingConnector });
        }
      } catch (error) {
        console.error("Reconnect failed:", error);
        sessionStorage.removeItem("connector");
      }
    }
  }, [address, connect, connectors]);

  async function connectWalletWithModal() {
    try {
      const result = await starknetkitConnectModal();
      
      if (!result?.connector) {
        toast.error("No wallet selected.");
        return;
      }

      const matchingConnector = connectors.find(
        (c) => c.id === result?.connector?.id
      );

      if (matchingConnector) {
        await connect({ connector: matchingConnector });
        toast.success("Connected successfully");
        
        sessionStorage.setItem("connector", JSON.stringify({ 
          id: result.connector.id 
        }));
      } else {
        toast.error("Could not find matching connector");
      }
    } catch (error) {
      toast.error("Error occurred. " + String(error) + " Please try again.");
    }
  }

  const disconnectWallet = async () => {
    try {
      setDropdownOpen(false);
      await disconnect();
      sessionStorage.removeItem("connector");
      toast.success("Wallet disconnected");
    } catch (error) {
      toast.error("Error occurred." + String(error) + " Please try again.");
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
                  className="w-full px-4 py-5 text-center text-red-600 hover:bg-red-100"
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