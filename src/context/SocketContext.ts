import { createContext } from "react";
import { Socket } from "socket.io-client";

const socketContext = createContext<Socket | undefined>(undefined);

export default socketContext;
