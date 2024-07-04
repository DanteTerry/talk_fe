import { useEffect } from "react";
import SingleConversation from "./SingleConversation";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getConversation, setActiveConversation } from "../features/chatSlice";
import { UserProfile } from "../types/types";

function Conversations({ searchText }: { searchText: string }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { conversations, activeConversation } = useSelector(
    (state) => state.chat,
  );

  useEffect(() => {
    if (user?.token) {
      dispatch(getConversation(user?.token));
    }
  }, [user, dispatch]);

  if (!conversations) {
    return <div>Loading...</div>;
  }

  if (searchText) {
    const filteredConversations = conversations.filter(
      (conversation: UserProfile) => {
        conversation.latestMessage ||
          conversation._id === activeConversation._id;
        conversation.name.toLowerCase().includes(searchText.toLowerCase());
        return conversation;
      },
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
    <div className="no-scrollbar h-screen overflow-y-scroll">
      {conversations &&
        conversations.map((conversation: UserProfile) => {
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

export default Conversations;
