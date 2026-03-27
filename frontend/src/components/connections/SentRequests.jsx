import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useEffect } from "react";
import { getTimeAgo } from "../../lib/utils";
import { useSentReqStore } from "../../store/connection/useSentReqStore";

// Mock data for sent invitations


const SentRequests = () => {
  const {getSentList, sentList, isSentListLoading, cancelRequest, isCancelLoading} = useSentReqStore();

  useEffect(()=>{
    getSentList();
  },[getSentList])

  const handleDelete = (userId) => {
    cancelRequest(userId);
  };

  return (
    <div>
      {/* Sent Invitations List */}
      <div className="space-y-3">
        {sentList.length === 0 ? (
          <p className="text-base-content/60 text-center py-8">
            No sent invitations
          </p>
        ) : (
          sentList.map((invitation) => (
            <div
              key={invitation._id}
              className="flex items-center justify-between p-4 border border-base-300 rounded-lg hover:bg-base-200 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <img
                    src={invitation.profilePic}
                    alt={invitation.fullName}
                    className="size-12 rounded-full object-cover"
                  />

                  <div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-base-content/60">
                        ID: {invitation.email.split('@')[0]}
                      </span>

                      <span className="font-medium text-base-content">
                        {invitation.fullName}
                      </span>

                      <span className="badge badge-warning badge-outline text-xs font-medium">
                        pending
                      </span>
                    </div>

                    <p className="text-xs text-base-content/60 mt-1">
                      {getTimeAgo(invitation.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDelete(invitation._id)}
                className="p-2 text-error hover:bg-error/10 rounded-md transition-colors"
                aria-label="Delete invitation"
              >
                <Trash2 className="size-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SentRequests;