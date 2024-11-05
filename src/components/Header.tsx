import React from 'react';

export default function Header() {
  return (
    <nav className='flex sticky top-0 shadow-lg p-5'>
        <div className="title">Student Registry</div>
        <div className="connect-wallet ml-auto bg-blue-500 text-white rounded-lg p-3">
            <button>Connect wallet</button>
        </div>
    </nav>
  )
};