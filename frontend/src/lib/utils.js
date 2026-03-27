export const formateMessageTime = (date) =>{
    return new Date(date).toLocaleTimeString("en-US", {
        hour:"2-digit",
        minute:"2-digit",
        hour12:true,
    });
}

export const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) {
      return `Requested ${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `Requested ${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      return `Requested ${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    }
  };