'use client';

interface CreatorInfoSectionProps {
  connectedWallet: string;
}

export function CreatorInfoSection({ connectedWallet }: CreatorInfoSectionProps) {
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-4">Creator Information</h2>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Connected Wallet</span>
          </label>
          <div className="flex items-center gap-3">
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-10">
                <span className="text-sm">
                  {connectedWallet.slice(2, 4).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <div className="font-mono text-sm bg-base-300 p-3 rounded">
                {connectedWallet}
              </div>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => navigator.clipboard.writeText(connectedWallet)}
              title="Copy address"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
          <label className="label">
            <span className="label-text-alt text-base-content/70">
              This wallet will be recorded as the poll creator
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
