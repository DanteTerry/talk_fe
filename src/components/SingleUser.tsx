import { UserPlus } from "lucide-react";
import { sendFriendRequest } from "../lib/utils/utils";
import { UserProfile } from "../types/types";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import SocketContext from "../context/SocketContext";
import { RootState } from "../app/store";

export function SingleUser({
  user,
  socket,
}: {
  user: UserProfile;
  socket: Socket;
}) {
  const { user: CurrentUser } = useSelector((state: RootState) => state.user);
  const { token } = useSelector((state: RootState) => state.user.user);
  const value = {
    sender: CurrentUser?._id,
    receiver: user?._id,
  };

  const { friends } = useSelector((state: RootState) => state.friends);

  const isFriend = friends.some(
    (friend) => friend._id === user?._id || friend._id === CurrentUser?._id,
  );

  const handleSendFriendRequest = async () => {
    try {
      // Attempt to send the friend request
      const data = await sendFriendRequest(token, value);

      if (data.success) {
        // Emit the socket event only if the request was successful
        socket.emit("send-friend-request", {
          sender: CurrentUser._id,
          receiver: user._id,
        });
      } else {
        console.error("Failed to send friend request:", data.message);
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SingleUserWithContext = (props: any) => (
  <SocketContext.Consumer>
    {(socket) => <SingleUser {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default SingleUserWithContext;
