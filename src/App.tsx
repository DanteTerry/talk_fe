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

function App() {
  const { accessToken: token } = useSelector((state) => state.user.user);
  const darkMode = useSelector((state) => state.darkMode.isDarkMode);

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={!token ? <Navigate to={"/login"} /> : <Home />}
          />
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
