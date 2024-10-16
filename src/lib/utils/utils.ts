import moment from "moment";
import axios from "axios";
import { User } from "../../features/userSlice";
import { SocketUser, UserDataForUtil } from "../../types/types";
import { onlineUser } from "../../features/onlineUserSlice";

const TRANSLATE_ENDPOINT = `${import.meta.env.VITE_APP_API_ENDPOINT}/translate`;
const LANGUAGE_ENDPOINT = `${import.meta.env.VITE_APP_API_ENDPOINT}/language`;

// get user's picture
export const trimString = (str: string, length: number) => {
  return str?.length > length ? str?.substring(0, length) + "..." : str;
};

// date handler
export const dateHandler = (date: string) => {
  const now = moment();
  const momentDate = moment(date);
  const diffInMinutes = now.diff(momentDate, "minutes");

  if (diffInMinutes < 1) {
    return "Just now";
  } else if (diffInMinutes < 60) {
    return momentDate.format("HH:mm");
  } else if (diffInMinutes < 1440) {
    return momentDate.format("HH:mm");
  } else if (diffInMinutes < 2880) {
    return "Yesterday";
  } else if (diffInMinutes < 10080) {
    return momentDate.format("dddd");
  } else {
    return momentDate.format("DD/MM/YYYY");
  }
};

// write another utility function like dateHandler in which only time is shown for all scenarios
export const timeHandler = (date: string) => {
  const momentDate = moment(date);
  return momentDate.format("HH:mm");
};

//  get conversation name
export const getConversationName = (user: User, users: UserDataForUtil[]) => {
  return users[0]._id === user?._id ? users[1]?.name : users[0]?.name;
};

// get conversation picture
export const getConversationPicture = (
  user: User,
  users: UserDataForUtil[],
) => {
  return users[0]._id === user?._id ? users[1]?.picture : users[0]?.picture;
};

// get conversation id
export const getConversationId = (user: User, users: UserDataForUtil[]) => {
  return users?.[0]?._id === user?._id ? users?.[1]?._id : users?.[0]?._id;
};

// check if user is online
export const checkOnlineStatus = (
  onlineUsers: onlineUser[],
  user: User,
  users: UserDataForUtil[],
) => {
  const conversationId = getConversationId(user, users);
  const check = onlineUsers?.find(
    (onlineUser: onlineUser) => onlineUser?.userId === conversationId,
  );
  return check?.userId ? true : false;
};

// check if file is image
export const trimFileName = (fileName: string, length: number = 20) => {
  const extensionIndex = fileName.lastIndexOf(".");
  const nameWithoutExtension = fileName.substring(0, extensionIndex);
  return nameWithoutExtension?.length > length
    ? nameWithoutExtension?.substring(0, length)
    : nameWithoutExtension;
};

// format file size
export const formatKbSize = (size: number) => {
  const formattedSize = (size / 1024).toFixed(2);
  return formattedSize + " KB";
};

// get users in conversation
export const getUsersInConversation = (
  users: string[],
  onlineUsers: onlineUser[],
) => {
  const onlineUsersInConversation = onlineUsers?.filter(
    (onlineUser: onlineUser) => users.includes(onlineUser.userId),
  );
  return onlineUsersInConversation;
};

// Update the function to use types
export const getOtherSocketUser = (
  user: User,
  users: SocketUser[],
): string | undefined => {
  const socketId = users.find(
    (socketUser) => socketUser.userId !== user._id,
  )?.socketId;

  return socketId;
};

// translate message
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const translateMessage = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messageDetail: any,
  token: string,
) => {
  try {
    const { data } = await axios.post(
      `${TRANSLATE_ENDPOINT}/one`,
      messageDetail,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return data;
  } catch (error: unknown) {
    console.log(error);
  }
};

// translate all messages
export const translatedAllMessages = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messageDetail: any,
  token: string,
) => {
  try {
    const { data } = await axios.post(`${TRANSLATE_ENDPOINT}`, messageDetail, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  } catch (error: unknown) {
    console.log(error);
  }
};

// create user's language
export const createUserLanguage = async (values: {
  token: string;
  language: string;
  user: string;
}) => {
  const { token, language, user } = values;

  try {
    const { data } = await axios.post(
      `${LANGUAGE_ENDPOINT}`,
      { language, user },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return data;
  } catch (error: unknown) {
    console.log(error);
  }
};

// change user's language
export const changeUserLanguage = async (values: {
  token: string;
  language: string;
  user: string;
}) => {
  const { token, language, user } = values;

  try {
    const { data } = await axios.patch(
      `${LANGUAGE_ENDPOINT}`,
      { language, user },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return data;
  } catch (error: unknown) {
    console.log(error);
  }
};

// send friend Request
export const sendFriendRequest = async (
  token: string,
  value: { sender: string; receiver: string },
) => {
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_APP_API_ENDPOINT}/friendRequest`,
      value,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (data?.success) {
      return data;
    } else {
      console.error(
        "Failed to send friend request:",
        data?.message || "Unknown error",
      );
      return { success: false, message: "Friend request failed" };
    }
  } catch (error) {
    console.error("Error during sending friend request:", error);
    return { success: false, message: "Error occurred while sending request" };
  }
};

// get friend requests
export const getFriendRequests = async (values: {
  token: string;
  id: string;
}) => {
  try {
    const { token, id } = values;
    const { data } = await axios.get(
      `${import.meta.env.VITE_APP_API_ENDPOINT}/friendRequest?id=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return data;
  } catch (error) {
    console.log(error);
  }
};

// accept friend request
export const acceptFriendRequest = async (
  token: string,
  value: { userId: string; friendId: string },
) => {
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_APP_API_ENDPOINT}/friends`,
      value,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (data?.success) {
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

// remove friend from friend list
export const removeFriend = async (
  token: string,
  value: { userId: string; friendId: string },
) => {
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_APP_API_ENDPOINT}/friends/removeFriend`,
      value,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (data?.success) {
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

// get user's friends
export const getFriends = async (token: string, id: string) => {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_APP_API_ENDPOINT}/friends?id=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (data?.success) {
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

// update status of friend request

export const updateFriendRequest = async (
  token: string,
  value: { id: string; status: string },
) => {
  try {
    const { data } = await axios.patch(
      `${import.meta.env.VITE_APP_API_ENDPOINT}/friendRequest`,
      value,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (data.success) {
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};
