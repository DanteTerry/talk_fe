import { UserPlus } from "lucide-react";
import { sendFriendRequest, trimString } from "../lib/utils/utils";
import { UserProfile } from "../types/types";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import SocketContext from "../context/SocketContext";

export function SingleUser({
  user,
  socket,
}: {
  user: UserProfile;
  socket: Socket;
}) {
  const { user: CurrentUser } = useSelector((state) => state.user);
  const { token } = useSelector((state) => state.user.user);
  const value = {
    sender: CurrentUser?._id,
    receiver: user?._id,
  };

  const { friends } = useSelector((state) => state.friends);

  const isFriend = friends.some(
    (friend) => friend._id === user?._id || friend._id === CurrentUser?._id,
  );

  const handleSendFriendRequest = async () => {
    const data = await sendFriendRequest(token, value);
    if (data) {
      socket.emit("send-friend-request", {
        sender: CurrentUser?._id,
        receiver: user?._id,
      });
    }
  };

  return (
    <div className="mb-3 flex w-full cursor-pointer items-center gap-3 rounded-md bg-green-500 px-2 py-3 dark:bg-white">
      <div className="h-12!important w-12 rounded-full">
        <img
          src={user?.picture}
          alt="user avatar"
          className="h-full w-full rounded-full object-cover"
        />
      </div>
      <div className="flex w-full justify-between">
        <div className="flex flex-col justify-between">
          <span className="font-semibold text-white opacity-95 dark:text-black">
            {user?.name}
          </span>
          <span className="text-[13px] font-semibold text-white opacity-95 dark:text-black">
            {trimString(user?.status)}
          </span>
        </div>
        {!isFriend ? (
          <UserPlus
            className="cursor-pointer self-start"
            onClick={handleSendFriendRequest}
          />
        ) : (
          <span className="font-semibold capitalize">friends</span>
        )}
      </div>
    </div>
  );
}

const SingleUserWithContext = (props) => (
  <SocketContext.Consumer>
    {(socket) => <SingleUser {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default SingleUserWithContext;
