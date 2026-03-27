import { useEffect } from "react";
import { Unlock } from "lucide-react";
import { useBlockedStore } from "../../store/connection/useBlockedStore";

const BlockedUsers = () => {
  const {getBlockedList, blockedList, isBlockListLoading, unblockRequest} = useBlockedStore();

  useEffect(()=>{
    getBlockedList();
  },[getBlockedList])

  const handleUnblock = (fId) => {
    unblockRequest(fId);
  };
  
  return (
    <div>
      {/* Blocked Users List */}
      <div className="space-y-3">
        {blockedList.length === 0 ? (
          <p className="text-base-content/60 text-center py-8">
            No blocked users
          </p>
        ) : (
          blockedList.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between p-4 border border-base-300 rounded-lg hover:bg-base-200 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <img
                    src={item.profilePic}
                    alt={item.fullName}
                    className="size-12 rounded-full object-cover"
                  />

                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-base-content/60">
                      ID: {item.email.split('@')[0]}
                    </span>

                    <span className="font-medium text-base-content">
                      {item.fullName}
                    </span>

                    <span className="badge badge-error badge-outline text-xs font-medium">
                      blocked
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUnblock(item._id)}
                  className="btn btn-neutral btn-sm flex items-center gap-2"
                >
                  <Unlock className="size-4" />
                  Unblock
                </button>

                {/* <button
                  onClick={() =>
                    handleUnblockAndChat(item._id, item.fullName)
                  }
                  className="btn btn-primary btn-sm flex items-center gap-2"
                >
                  <MessageCircle className="size-4" />
                  Unblock & Chat
                </button> */}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default BlockedUsers;