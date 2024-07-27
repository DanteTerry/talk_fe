import moment from "moment";

export const trimString = (str: string, length: number = 27) => {
  return str?.length > length ? str?.substring(0, length) + "..." : str;
};

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
  return momentDate.format("HH:MM");
};

//
export const getConversationName = (user, users) => {
  return users[0]._id === user._id ? users[1].name : users[0].name;
};

export const getConversationPicture = (user, users) => {
  return users[0]._id === user._id ? users[1].picture : users[0].picture;
};

export const getConversationId = (user, users) => {
  return users[0]?._id === user?._id ? users[1]?._id : users[0]?._id;
};

export const checkOnlineStatus = (onlineUsers, user, users) => {
  const conversationId = getConversationId(user, users);
  const check = onlineUsers?.find(
    (onlineUser) => onlineUser?.userId === conversationId,
  );

  return check?.userId ? true : false;
};

export const trimFileName = (fileName: string, length: number = 20) => {
  const extensionIndex = fileName.lastIndexOf(".");
  const nameWithoutExtension = fileName.substring(0, extensionIndex);
  return nameWithoutExtension?.length > length
    ? nameWithoutExtension?.substring(0, length)
    : nameWithoutExtension;
};

export const formatKbSize = (size: number) => {
  const formattedSize = (size / 1024).toFixed(2);
  return formattedSize + " KB";
};

export const getUsersInConversation = (users, onlineUsers) => {
  const onlineUsersInConversation = onlineUsers?.filter((onlineUser) =>
    users.includes(onlineUser.userId),
  );
  return onlineUsersInConversation;
};

export const getOtherSocketUser = (user: [], users: []) => {
  const socketId = users?.filter(
    (socketUser: { userId: string; socketId: string }) =>
      socketUser?.userId !== user?._id,
  )[0]?.socketId;

  return socketId;
};
