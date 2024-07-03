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
import Message from "./components/Message";
import Search from "./components/SearchUser";
import Friends from "./components/Friends";
import AddFriend from "./components/AddFriend";
import Profile from "./components/Profile";

function App() {
  const { token } = useSelector((state) => state.user.user);
  const darkMode = useSelector((state) => state.darkMode.isDarkMode);

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
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
            <Route path="add-friends" element={<AddFriend />} />
            <Route path="profile" element={<Profile />} />
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
    </div>
  );
}

export default App;
