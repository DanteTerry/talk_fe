import { MessageCircleMore, Search, UserPlus, Users } from "lucide-react";

export const sidebarItems = [
  {
    name: "messages",
    icon: MessageCircleMore,
    url: "messages",
  },
  {
    name: "search",
    icon: Search,
    url: "search",
  },
  {
    name: "friends",
    icon: Users,
    url: "friends",
  },
  {
    name: "add-friends",
    icon: UserPlus,
    url: "add-friends",
  },
];

export const messages = [
  {
    sender: "Arpit Yadav",
    messages: [
      {
        message: "Hello there!",
        time: "10:00",
      },
      {
        message: " how are you doing?",
        time: "10:01",
      },
    ],
  },
  {
    sender: "Terry Yadav",
    messages: [
      {
        message: "Ahoy !",
        time: "10:00",
      },
      {
        message: "I am good, how about you?",
        time: "10:01",
      },
    ],
  },
];
