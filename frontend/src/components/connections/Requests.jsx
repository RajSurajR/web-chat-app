import { useState } from 'react';
import ReceivedRequests  from './ReceivedRequests';
import SentRequests from './SentRequests';
import BlockedUsers  from './BlockedUsers';

const Requests = () => {
  const [activeTab, setActiveTab] = useState('received');

  return (
    <div>
      {/* Sub-tabs */}
      <div className="flex gap-3 mb-6 border-b border-base-300">
        <button
          onClick={() => setActiveTab('received')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'received'
              ? 'border-primary text-primary'
              : 'border-transparent opacity-60 hover:opacity-100'
          }`}
        >
          Received
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'sent'
              ? 'border-primary text-primary'
              : 'border-transparent opacity-60 hover:opacity-100'
          }`}
        >
          Sent
        </button>

        <button
          onClick={() => setActiveTab('blocked')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'blocked'
              ? 'border-primary text-primary'
              : 'border-transparent opacity-60 hover:opacity-100'
          }`}
        >
          Blocked Users
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'received' ? (
        <ReceivedRequests />
      ) : activeTab === 'sent' ? (
        <SentRequests />
      ) : (
        <BlockedUsers />
      )}
    </div>
  );
}

export default Requests;