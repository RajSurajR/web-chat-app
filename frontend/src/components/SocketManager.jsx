import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

const SocketManager = () => {
  const { user, isLoaded } = useAuthStore();
  const { connectSocket, disconnectSocket } = useAuthStore();

  useEffect(() => {
    if (!isLoaded) return;

    if (user) {
      connectSocket(user.id);
    } else {
      disconnectSocket();
    }
  }, [user, isLoaded]);

  return null;
}



export default SocketManager