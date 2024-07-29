import { useEffect } from "react";
import SingleConversation from "./SingleConversation";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getConversation } from "../features/chatSlice";
import { Conversation, UserProfile } from "../types/types";
import { checkOnlineStatus } from "../lib/utils/utils";

function Conversations({ searchText }: { searchText: string }) {
  const onlineUsers = useSelector((state) => state.onlineUsers);

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const { conversations } = useSelector((state) => state.chat);

  useEffect(() => {
    if (user?.token) {
      dispatch(getConversation(user?.token));
    }
  }, [user, dispatch]);

  if (!conversations) {
    return <div>Loading...</div>;
  }

  const filteredConversations = conversations.filter(
    (conversation: UserProfile) =>
      conversation.name.toLowerCase().includes(searchText.toLowerCase()) &&
      !conversation.isGroup,
  );

  if (searchText) {
    const filteredConversations = conversations.filter(
      (conversation: UserProfile) =>
        conversation.name.toLowerCase().includes(searchText.toLowerCase()) &&
        !conversation.isGroup,
    );

    return (
      <div className="no-scrollbar h-screen overflow-y-scroll">
        {filteredConversations.map((conversation: UserProfile) => {
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
