import { useDispatch } from "react-redux";
import { logout } from "../features/userSlice";

function Profile() {
  const dispatch = useDispatch();
  return (
    <div>
      <h1>Profile</h1>
      <p>Welcome to your profile page</p>
      <button onClick={() => dispatch(logout())}>Log out</button>
    </div>
  );
}

export default Profile;
