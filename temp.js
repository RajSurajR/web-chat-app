subscribeToMessage: () => {
  const socket = useAuthStore.getState().socket;
  if (!socket) return;

  socket.on("newMessage", (newMessage) => {

    const { selectedConv, messages, conversations } = get();

    // 1️⃣ If current conversation open
    if (selectedConv?._id === newMessage.conversationId) {
      set({
        messages: [...messages, newMessage]
      });
    }
//     set((state) => ({
//   messages: [...state.messages, newMessage]
// }));

    // 2️⃣ Update conversation sidebar
    const updatedConversations = conversations.map((conv) => {

      if (conv._id !== newMessage.conversationId) return conv;

      return {
        ...conv,
        lastMessage: newMessage.text,
        unreadCount:
          selectedConv?._id === conv._id
            ? 0
            : (conv.unreadCount || 0) + 1
      };

    });

    // 3️⃣ Move conversation to top
    const sorted = updatedConversations.sort((a, b) => {
      if (a._id === newMessage.conversationId) return -1;
      if (b._id === newMessage.conversationId) return 1;
      return 0;
    });

    set({ conversations: sorted });

  });
}
selectConversation: (conv) => {
  set((state) => ({
    selectedConv: conv,
    conversations: state.conversations.map(c =>
      c._id === conv?._id
        ? { ...c, unreadCount: 0 }
        : c
    )
  }));
}
    // update conversation sidebar
            const updatedConversations = conversations.map((conv)=>{
                if(conv._id !== newMessage.conversationId) return conv;

                return {
                    ...conv,
                    lastMessage: newMessage.text || null,
                    unreadCount: selectedConv?._id === conv._id 
                        ? 0 : (conv.unreadCount || 0) + 1
                };
            });
            // reorder conversation to top
            const sorted = updatedConversations.sort((a, b) => {
                if(a._id === newMessage.conversationId) return -1;
                if(b._id == newMessage.conversationId) return 1;
                return 0;
            })
