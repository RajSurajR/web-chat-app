import { useState } from 'react';
import AddFriend from '../components/connections/AddFriend';
import AllFriends from '../components/connections/AllFriends';
import Requests from '../components/connections/Requests';

const ConnectionPage = () => {
  const [activeView, setActiveView] = useState('allFriends');

  return (
    <div className="size-full min-h-screen bg-base-200 p-6 pt-20">
      <div className="max-w-4xl mx-auto">
        {/* Top Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveView('allFriends')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors btn ${
              activeView === 'allFriends'
                ? 'btn-primary'
                : 'btn-ghost'
            }`}
          >
            All Friends
          </button>

          <button
            onClick={() => setActiveView('addFriend')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors btn ${
              activeView === 'addFriend'
                ? 'btn-primary'
                : 'btn-ghost'
            }`}
          >
            Add Friends
          </button>

          <button
            onClick={() => setActiveView('requests')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors btn ${
              activeView === 'requests'
                ? 'btn-primary'
                : 'btn-ghost'
            }`}
          >
            Requests
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-base-100 rounded-lg shadow-sm p-6">
          {activeView === 'allFriends' ? (
            <AllFriends />
          ) : activeView === 'addFriend' ? (
            <AddFriend goToRequests={() => setActiveView("requests")} />
          ) : (
            <Requests />
          )}
        </div>
      </div>
    </div>
  );
}

export default ConnectionPage;