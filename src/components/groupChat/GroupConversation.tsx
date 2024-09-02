import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getConversation } from "../../features/chatSlice";
import { Conversation } from "../../types/types";
import SingleGroupConversation from "./SingleGroupConversation";
import { AppDispatch, RootState } from "../../app/store";

function GroupConversation({ searchText }: { searchText: string }) {
  const dispatch = useDispatch<AppDispatch>();

  const { user } = useSelector((state: RootState) => state.user);
  const { conversations } = useSelector((state: RootState) => state.chat);

  useEffect(() => {
    if (user?.token) {
      dispatch(getConversation(user?.token));
    }
  }, [user, dispatch]);

  if (!conversations) {
    return <div>Loading...</div>;
  }

  const groupConversations = conversations.filter(
    (conversation: Conversation) => conversation.isGroup === true,
  );

  if (searchText) {
    const filteredConversations = groupConversations.filter(
      (conversation: Conversation) =>
        conversation.name.toLowerCase().includes(searchText.toLowerCase()),
    );

    return (
      <div className="no-scrollbar h-screen overflow-y-scroll">
        {filteredConversations.map((conversation: Conversation) => {
          return (
            <SingleGroupConversation
              key={conversation._id}
              conversation={conversation}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className="no-scrollbar h-screen overflow-y-scroll">
      {conversations &&
        groupConversations.map((conversation: Conversation) => {
          return (
            <SingleGroupConversation
              key={conversation._id}
              conversation={conversation}
            />
          );
        })}
    </div>
  );
}

export default GroupConversation;
