import { Trash2, MessageCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useFriendStore } from '../../store/connection/useFriendStore';
import { useState } from 'react';
import CustomAlert from '../utils/CustomAlert';
import { useNavigate } from "react-router-dom";

const AllFriends = () => {
    const {getFriendsList, friendsList, isFriendsLoading, deleteFriend, startChat} = useFriendStore();
  
    const [deleteId, setDeleteId] = useState(null);
    const navigate = useNavigate();

    useEffect(()=>{
      getFriendsList();
    }, [getFriendsList])

    const handleDelete = () => {
      if(!deleteId || !deleteId.fId) return;
      deleteFriend(deleteId.fId);
      setDeleteId(null);
    };

  const redirectHomePage = ()=>{
    navigate("/");
  }
  const handleStartChat = (ouId) => {
    startChat(ouId, redirectHomePage);
  };

  return (
    <div>
    <CustomAlert 
        isOpen={deleteId!==null}
        title={`Are you Sure to Remove ${deleteId?.name} from friendship list?`}
        message="This action Delete the user you are not able to chat."
        onConfirm={() => {handleDelete()}}
        onCancel={() => { setDeleteId(null)}}
      /> 
      <h2 className="text-xl font-semibold mb-6">All Friends</h2>

      {/* Friends List */}
      <div className="space-y-3">
        {friendsList.length === 0 ? (
          <p className="opacity-60 text-center py-8">No friends found</p>
        ) : (
          friendsList.map((friend) => (
            <div
              key={friend._id}
              className="flex items-center justify-between p-4 border border-base-300 rounded-lg hover:bg-base-200 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <img
                    src={friend.profilePic}
                    alt={friend.fullName}
                    className="size-12 rounded-full object-cover"
                  />
                  <div className="flex items-center gap-4">
                    <span className="text-sm opacity-60">
                      ID: {friend.email.split('@')[0]}
                    </span>
                    <span className="font-medium">
                      {friend.fullName}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStartChat(friend.ouId)}
                  className="btn btn-sm btn-primary flex items-center gap-2"
                >
                  <MessageCircle className="size-4" />
                  Start Chat
                </button>

                <button
                  onClick={() => setDeleteId({fId:friend._id, name:friend.fullName})}
                  className="btn btn-sm btn-ghost text-error"
                  aria-label="Delete friend"
                >
                  <Trash2 className="size-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AllFriends;