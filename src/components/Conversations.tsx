import { useEffect } from "react";
import SingleConversation from "./SingleConversation";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getConversation } from "../features/chatSlice";
import { Conversation } from "../types/types";
import { checkOnlineStatus } from "../lib/utils/utils";
import { AppDispatch, RootState } from "../app/store";

function Conversations({ searchText }: { searchText: string }) {
  const onlineUsers = useSelector((state: RootState) => state.onlineUsers);

  const dispatch = useDispatch<AppDispatch>();

  const { user } = useSelector((state: RootState) => state.user);
  const conversations: Conversation[] = useSelector(
    (state: RootState) => state.chat.conversations,
  );
  useEffect(() => {
    if (user?.token) {
      dispatch(getConversation(user?.token));
    }
  }, [user, dispatch]);

  if (!conversations) {
    return <div>Loading...</div>;
  }

  const filteredConversations = conversations.filter(
    (conversation: Conversation) =>
      conversation?.name?.toLowerCase().includes(searchText.toLowerCase()) &&
      !conversation?.isGroup,
  );

  if (searchText) {
    const filteredConversations = conversations.filter(
      (conversation: Conversation) =>
        conversation?.name?.toLowerCase().includes(searchText.toLowerCase()) &&
        !conversation?.isGroup,
    );

    return (
      <div className="no-scrollbar h-screen overflow-y-scroll">
        {filteredConversations.map((conversation: Conversation) => {
          return (
            <SingleConversation
              key={conversation._id}
              conversation={conversation}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={`no-scrollbar h-full overflow-y-scroll ${conversations.length > 6 ? "pb-[160px] lg:pb-0" : ""}`}
    >
      {conversations &&
        filteredConversations.map((conversation: Conversation) => {
          return (
            <SingleConversation
              key={conversation._id}
              conversation={conversation}
              online={checkOnlineStatus(onlineUsers, user, conversation.users)}
            />
          );
        })}
    </div>
  );
}

export default Conversations;
