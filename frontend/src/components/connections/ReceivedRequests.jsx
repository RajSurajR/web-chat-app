import { useState } from "react";
import { X, Clock, MessageCircle, MoreVertical,  Ban,} from "lucide-react";
import { useEffect } from "react";
import { getTimeAgo } from "../../lib/utils";
import CustomAlert from "../utils/CustomAlert";
import { useReceivedReqStore } from "../../store/connection/useReceivedReqStore";
import { useFriendStore } from "../../store/connection/useFriendStore";

const ReceivedRequests = () => {
   const {getRequestList, requestList, isReqListLoading,acceptRequest, isAcceptLoading,
     rejectRequest, isRejectLoading, blockRequest, isBlockLoading,} = useReceivedReqStore();
  const { startChat} = useFriendStore();
  const [blockedId, setBlockedId] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectDetail, setSelectDetail] = useState(null)

  useEffect(()=>{
    getRequestList();
  }, [getRequestList])

  const handleAccept = (fId) => {
    acceptRequest(fId);
  
  };

  const redirectHomePage = ()=>{
    navigate("/");
  }
  const handleAcceptAndChat = (fId, ouId) => {
    const res = acceptRequest(fId);
    // todo: chat open
    if(res){
      startChat(ouId, redirectHomePage);
    }
  };

  const handleDecline = (fId) => {
    rejectRequest(fId);
  };

  const handleBlock = () => {
    if(!blockedId || !blockedId.fId) return;
    blockRequest(blockedId.fId);
    setBlockedId(null);
  };

  // if(isReqListLoading){
  //   <div className="flex justify-center items-center">
  //     <h2>Loading...</h2>
  //   </div>
  // }
  return (
    <div>
    <CustomAlert 
        isOpen={blockedId!==null}
        title={`Are you want to block ${blockedId?.name}?`}
        message="This action block the user you are not able to chat."
        onConfirm={()=>{handleBlock()}}
        onCancel={()=>{setBlockedId(null)}}
      /> 
      {/* Invitations List */}
      <div className="space-y-3">
        {requestList.length === 0 ? (
          <p className="text-base-content/60 text-center py-8">
            No pending invitations
          </p>
        ) : (
          requestList.map((invitation) => (
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
                    </div>
                    <p className="text-xs text-base-content/60 mt-1">
                      {getTimeAgo(invitation.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAccept(invitation._id)}
                  className="btn btn-success btn-sm flex items-center gap-2"
                >
                  <Clock className="size-4" />
                  Accept
                </button>

                <button
                  onClick={() =>handleAcceptAndChat(invitation._id, invitation.ouId) }
                  className="btn btn-primary btn-sm flex items-center gap-2"
                >
                  <MessageCircle className="size-4" />
                  Accept & Chat
                </button>

                <button
                  onClick={() => handleDecline(invitation._id)}
                  className="btn btn-outline btn-sm flex items-center gap-2"
                >
                  <X className="size-4" />
                  Decline
                </button>
                <button
                  onClick={() => setBlockedId({fId:invitation._id, name:invitation.fullName})}
                  className="btn btn-sm border-error/15 text-error hover:bg-error/10 transition-colors flex items-center gap-2"
                >
                  <Ban className="size-4" />
                  Block
                </button>

                {/* Three-dot menu */}
                {/* <div className="relative">
                  <button
                    onClick={() => setOpenMenuId( openMenuId === invitation._id ? null: invitation._id ) }
                    className="p-2 text-base-content/60 hover:bg-base-200 rounded-md transition-colors"
                    aria-label="More options"
                  >
                    <MoreVertical className="size-5" />
                  </button>
                  {openMenuId === invitation._id && (
                    <div className="absolute right-0 top-full mt-1 w-40 bg-base-100 border border-base-300 rounded-md shadow-lg z-10">
                      // button
                    </div>
                  )}
                </div> */}

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ReceivedRequests;
