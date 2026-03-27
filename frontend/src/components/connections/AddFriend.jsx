import { useState } from 'react';
import { Search, UserPlus } from 'lucide-react';
import { useEffect } from 'react';
import { useSearchStore } from '../../store/connection/useSearchStore';

const AddFriend = ({goToRequests}) => {
  const {serachUsers, usersSearchList, isSearchLoading, sentRequest, requestLoading } = useSearchStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [pageNum, setPageNum] = useState(1);
  const [sentReqId, setSentReqId] = useState(null);

  const handleSendRequest = (fId) => {
    // TODO : request sent already user request button disable
    setSentReqId(fId);
    sentRequest(fId);
    setSentReqId(null);
  };


  useEffect(() => {
    if (!searchQuery.trim()) {
      serachUsers("");
      return;
    }
    if(searchQuery.length < 3) return;

    const delayDebounceFn = setTimeout(async () => {
      serachUsers(searchQuery, pageNum);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <div>
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 opacity-50" />
        <input
          type="text"
          placeholder="Search users by name or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-base-100"
        />
      </div>

      {/* Search Results */}
      <div className="space-y-3">
        {searchQuery.trim() === '' ? (
          <p className="opacity-60 text-center py-8">
            Enter a name or user ID to search for friends
          </p>
        ) : usersSearchList.length === 0 ? (
          <p className="opacity-60 text-center py-8">No users found</p>
        ) : (
          usersSearchList.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between p-4 border border-base-300 rounded-lg hover:bg-base-200 transition-colors"
            >
              <div className="flex items-center gap-4">
                <img
                  src={user.profilePic}
                  alt={user.fullName}
                  className="size-12 rounded-full object-cover"
                />
                <div className="flex items-center gap-4">
                  <span className="text-sm opacity-60">
                    ID: {user.email.split('@')[0]}
                  </span>
                  <span className="font-medium">{user.fullName}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  if(user.relationshipStatus === "none"){
                    handleSendRequest(user._id)
                  } else if(user.relationshipStatus === "received"){
                    console.log("click");
                    goToRequests();
                  }
                }}
                disabled={user.relationshipStatus !== "none"}
                className={`btn btn-sm flex items-center gap-2 
                  ${ user.relationshipStatus === "none" ? "btn-primary" : "btn-disabled" }`
                }
              >
                <UserPlus className="size-4" />
                {sentReqId === user._id
                  ? "Sending..."
                  : user.relationshipStatus === "sent"
                  ? "Requested"
                  : user.relationshipStatus === "received"
                  ? "Respond"
                  : user.relationshipStatus === "friends"
                  ? "Friends"
                  :user.relationshipStatus === "blocked"
                  ? "Blocked"
                  : "Send Request"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AddFriend;