import chatDarkLogo from "../assets/chatGreen.svg";
import { Sun, SunMoon } from "lucide-react";
import { sidebarItems } from "../constants/constants";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toggleDarkMode } from "../features/darkmodeSlice";
import { useSelector } from "react-redux";

function SideMenu() {
  const location = useLocation();
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.darkMode.isDarkMode);

  return (
    <aside className="flex h-full w-[130px] flex-col items-center justify-between pb-10 dark:bg-[#17181B]">
      <img src={chatDarkLogo} className="w-[100px]" />

      <div className="flex w-full flex-col items-center gap-8">
        {sidebarItems.map((items, index) => {
          return (
            <Link to={`${items.url}`} key={items.name}>
              <div
                key={index}
                className={`flex h-14 w-14 items-center justify-center rounded-xl ${items.name === location.pathname.split("/")[1] && "bg-[#E8EBF9] dark:bg-[#202124]"}`}
              >
                <items.icon
                  size={36}
                  className="text-black dark:text-white"
                  strokeWidth={1.25}
                />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-8">
        <div
          onClick={() => dispatch(toggleDarkMode())}
          className="cursor-pointer"
        >
          {!darkMode ? (
            <Sun
              size={36}
              strokeWidth={1.25}
              className="text-black dark:text-white"
            />
          ) : (
            <SunMoon
              size={36}
              strokeWidth={1.25}
              className="text-black dark:text-white"
            />
          )}
        </div>
        <Link to="/profile">
          <div className="h-10 w-10 cursor-pointer rounded-full">
            <img
              src="https://gravatar.com/avatar/d6771c28560592154cf60f8bea68d484?s=400&d=retro&r=x"
              alt="user avatar"
              className="h-full w-full rounded-full object-cover"
            />
          </div>
        </Link>
      </div>
    </aside>
  );
}

export default SideMenu;
