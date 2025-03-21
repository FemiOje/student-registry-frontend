import { useState } from "react";
import { HeaderProps } from "../types";

export default function Header({ address, openModal, disconnectWallet }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
                  onClick={() => {
                    disconnectWallet();
                    setDropdownOpen(false);
                  }}
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
            onClick={() => openModal()}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
}
