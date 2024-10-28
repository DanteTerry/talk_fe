import { Socket } from "socket.io-client";
import SocketContext from "../context/SocketContext";
import { Check, X } from "lucide-react";
import {
  acceptFriendRequest,
  getFriends,
  updateFriendRequest,
} from "../lib/utils/utils";
import { useDispatch } from "react-redux";
import { setFriendRequests } from "../features/notificationSlice";
import { setFriends } from "../features/friendSlice";
import { AppDispatch, RootState } from "../app/store";
import { FriendRequest } from "../types/types";
import { useSelector } from "react-redux";

export function Notification({ socket }: { socket: Socket }) {
  const user = useSelector((state: RootState) => state.user.user);
  const notification = useSelector(
    (state: RootState) => state.notification.friendRequests,
  );

  // Filter notifications for the current user with "pending", "accepted", and "rejected" statuses
  const pendingRequests = notification.friendRequests?.filter(
    (request: FriendRequest) =>
      user._id === request.receiver._id && request.status === "pending",
  );

  const completedRequests = notification.friendRequests?.filter(
    (request: FriendRequest) =>
      // Show accepted requests to only the sender
      (user._id === request.sender._id && request.status === "accepted") ||
      // Show rejected requests only to the sender
      (user._id === request.sender._id && request.status === "rejected"),
  );

  const { token } = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch<AppDispatch>();

  // Reject friend request
  const requestRejectHandler = async (request: FriendRequest) => {
    await updateFriendRequest(token, {
      id: request._id,
      status: "rejected",
    });

    socket.emit("reject-friend-request", {
      friendId: request.sender?._id,
    });

    // Filter out rejected requests from the list
    const updatedRequest = notification.friendRequests.filter(
      (req: FriendRequest) => req._id !== request._id,
    );

    dispatch(setFriendRequests(updatedRequest));
  };

  // Accept friend request
  const requestAcceptHandler = async (request: FriendRequest) => {
    const value = {
      userId: request.receiver?._id,
      friendId: request.sender?._id,
    };

    const data = await acceptFriendRequest(token, value);
    if (data.success) {
      socket.emit("accept-friend-request", {
        friendId: request.sender?._id,
      });

      await updateFriendRequest(token, {
        id: request._id,
        status: "accepted",
      });

      const updatedRequest = notification.friendRequests.map(
        (req: FriendRequest) => {
          if (req._id === request._id) {
            return { ...req, status: "accepted" };
          }
          return req;
        },
      );

      dispatch(setFriendRequests(updatedRequest));

      const friends = await getFriends(token, user._id);
      if (friends?.success) {
        dispatch(setFriends(friends?.friends));
      }
    }
  };

  return (
    <div className="flex w-full flex-col gap-10 py-5">
      <div className="flex w-full justify-center">
        <h2 className="text-3xl text-green-500">Notifications</h2>
      </div>
      <div className="flex w-full flex-col items-center gap-2 md:px-3">
        {pendingRequests?.length > 0 || completedRequests?.length > 0 ? (
          <>
            {/* Display Pending Requests */}
            {pendingRequests?.map((request: FriendRequest) => (
              <div className="w-full" key={request._id}>
                <div className="flex w-full items-center justify-center gap-3 rounded-md bg-green-500 bg-white px-2">
                  <div className="flex h-14 w-14 items-center rounded-full">
                    <img
                      src={request.sender.picture}
                      alt="user avatar"
                      className="w-14!important h-14!important rounded-full object-cover"
                    />
                  </div>
                  <div className="flex w-full flex-col justify-between">
                    <div className="flex flex-col">
                      <span className="w-max font-semibold text-green-500">
                        {request.sender.name}
                      </span>
                      <span className="w-max text-[13px] font-semibold leading-none text-green-500">
                        sent you a friend request
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="rounded-full bg-red-700 p-1 text-white"
                      onClick={() => requestRejectHandler(request)}
                    >
                      <X size={22} />
                    </button>
                    <button
                      className="rounded-full bg-green-700 p-1 text-white"
                      onClick={() => requestAcceptHandler(request)}
                    >
                      <Check size={22} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Display Accepted and Rejected Requests */}
            {completedRequests.map((request: FriendRequest) => (
              <div className="w-full" key={request._id}>
                <div className="flex w-full items-center justify-center gap-3 rounded-md bg-green-500 px-2 py-1 dark:bg-white">
                  <div className="flex h-14 w-14 items-center overflow-hidden rounded-full">
                    <img
                      src={
                        user._id === request.sender._id
                          ? request.receiver.picture
                          : request.sender.picture
                      }
                      alt="user avatar"
                      className="w-14!important h-14!important rounded-full object-cover"
                    />
                  </div>
                  <div className="flex w-full flex-col justify-between">
                    <div className="flex flex-col">
                      <span className="w-max font-semibold text-white dark:text-green-500">
                        {user._id === request.sender._id
                          ? request.receiver.name
                          : request.sender.name}
                      </span>
                      <span
                        className={`w-max text-[13px] font-semibold leading-none ${
                          request.status === "accepted"
                            ? "text-white dark:text-green-500"
                            : "text-red-700"
                        }`}
                      >
                        {request.status === "accepted"
                          ? "accepted your friend request"
                          : "rejected your friend request"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2"></div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <h2 className="text-xl text-green-500">No new notifications</h2>
        )}
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const NotificationWithContext = (props: any) => (
  <SocketContext.Consumer>
    {(socket) => <Notification {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default NotificationWithContext;
