import { MessageCircleMore, Search, User, Bell, Users } from "lucide-react";

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
    icon: User,
    url: "friends",
  },
  {
    name: "group-chat",
    icon: Users,
    url: "group-chat",
  },
  {
    name: "notifications",
    icon: Bell,
    url: "notifications",
  },
];
