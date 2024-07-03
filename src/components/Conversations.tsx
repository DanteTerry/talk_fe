import React, { useEffect } from "react";
import SingleConversation from "./SingleConversation";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getConversation } from "../features/chatSlice";

function Conversations() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { conversations } = useSelector((state) => state.chat);

  useEffect(() => {
    if (user?.token) {
      dispatch(getConversation(user?.token));
    }
  }, [user]);

  return (
    <div className="no-scrollbar h-screen overflow-y-scroll">
      {conversations &&
        conversations.map((conversation) => {
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
