import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import { useSelector } from "react-redux";
import Register from "./pages/register";
import Message from "./components/MessageBar";
import Search from "./components/SearchUser";
import Friends from "./components/Friends";
import GroupChat from "./components/groupChat/GroupChat";
import Profile from "./components/Profile";
import { io } from "socket.io-client";
import SocketContext from "./context/SocketContext";
import Notification from "./components/Notification";

// socket.io-client
const localhost = import.meta.env.VITE_APP_LOCALHOST;
const socket = io(localhost, {
  autoConnect: true,
  reconnection: true,
});

function App() {
  const { token } = useSelector((state) => state.user.user);
  const darkMode = useSelector((state) => state.darkMode.isDarkMode);

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <SocketContext.Provider value={socket}>
        <Router>
          <Routes>
            <Route
              path="/"
              element={!token ? <Navigate to={"/login"} /> : <Home />}
            >
              <Route index element={<Navigate to={"messages"} />} />
              <Route path="messages" element={<Message />} />
              <Route path="search" element={<Search />} />
              <Route path="friends" element={<Friends />} />
              <Route path="group-chat" element={<GroupChat />} />
              <Route path="profile" element={<Profile />} />
              <Route path="notifications" element={<Notification />} />
            </Route>
            <Route
              path="/login"
              element={!token ? <Login /> : <Navigate to={"/"} />}
            />
            <Route
              path="/register"
              element={!token ? <Register /> : <Navigate to={"/"} />}
            />
          </Routes>
        </Router>
      </SocketContext.Provider>
    </div>
  );
}

export default App;
