import { useDispatch } from "react-redux";
import { logout } from "../features/userSlice";
import { useSelector } from "react-redux";
import { LogOut, Pencil } from "lucide-react";

function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.user);
  return (
    <div className="flex h-[82vh] w-full flex-col items-center gap-5 p-4">
      <h1 className="text-2xl font-semibold text-green-500 dark:text-white">
        Profile
      </h1>
      <div className="flex h-full w-full flex-col items-center justify-center gap-5">
        <div className="w-1/2 rounded-full lg:w-2/4">
          <img
            src={user?.picture}
            className="w-full rounded-full object-cover"
            alt="profile"
          />
        </div>
        <div className="flex w-full flex-col items-center gap-1">
          <h1 className="text-2xl font-bold text-green-500 dark:text-white">
            {user?.name}
          </h1>
          <p className="text-lg text-green-500 dark:text-white">
            {user?.email}
          </p>

          <p className="text-lg text-green-500 dark:text-white">
            {user?.status}
          </p>

          <div className="mt-2 flex gap-3">
            <button
              className="rounded-md bg-green-500 px-2 py-1 text-xl text-green-500 dark:text-white"
              onClick={() => dispatch(logout())}
            >
              <Pencil size={25} color="white" />
            </button>
            <button
              className="rounded-md bg-green-500 px-2 py-1 text-xl text-green-500 dark:text-white"
              onClick={() => dispatch(logout())}
            >
              <LogOut color="white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
