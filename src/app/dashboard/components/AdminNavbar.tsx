'use client';

import Link from 'next/link';
import { useState } from 'react';

export function AdminNavbar() {
  const [connectedWallet, setConnectedWallet] = useState<string | null>(
    '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb' // Mock wallet - will be replaced with wagmi
  );

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="navbar bg-base-200 shadow-lg sticky top-0 z-50">
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost normal-case text-xl font-bold">
          <span className="text-primary">DeVote</span>
          <span className="text-base-content/70 ml-2 text-sm hidden sm:inline">Admin</span>
        </Link>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/dashboard" className="active">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/create-poll">
              Create Poll
            </Link>
          </li>
          <li>
            <a>Documentation</a>
          </li>
        </ul>
      </div>
      
      <div className="navbar-end gap-2">
        {/* Wallet Connection Status */}
        {connectedWallet ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost gap-2">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-8">
                  <span className="text-xs">
                    {connectedWallet.slice(2, 4).toUpperCase()}
                  </span>
                </div>
              </div>
              <span className="font-mono text-sm hidden sm:inline">
                {truncateAddress(connectedWallet)}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow-xl bg-base-100 rounded-box w-52 mt-4">
              <li className="menu-title">
                <span>Account</span>
              </li>
              <li>
                <a className="font-mono text-xs">
                  {connectedWallet}
                </a>
              </li>
              <li>
                <a onClick={() => navigator.clipboard.writeText(connectedWallet)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Address
                </a>
              </li>
              <div className="divider my-0"></div>
              <li>
                <a className="text-error" onClick={() => setConnectedWallet(null)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Disconnect
                </a>
              </li>
            </ul>
          </div>
        ) : (
          <button 
            className="btn btn-primary gap-2"
            onClick={() => setConnectedWallet('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Connect Wallet
          </button>
        )}

        {/* Mobile Menu */}
        <div className="dropdown dropdown-end lg:hidden">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
            <li><Link href="/dashboard">Dashboard</Link></li>
            <li><Link href="/create-poll">Create Poll</Link></li>
            <li><a>Documentation</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

