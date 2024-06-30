import chatLogo from "../assets/chat3.svg";
import chatDarkLogo from "../assets/chatDark.svg";
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
    <aside className="flex w-full flex-col items-center justify-between">
      <img src={chatDarkLogo} className="fill-white" />

      <div className="flex w-full flex-col items-center gap-8">
        {sidebarItems.map((items, index) => {
          return (
            <div
              key={index}
              className={`flex h-14 w-14 items-center justify-center rounded-xl ${items.name === location.pathname && "bg-[#E8EBF9]"}`}
            >
              <Link to={`${items.url}`}>
                <items.icon
                  size={36}
                  className="text-black dark:text-white"
                  strokeWidth={1.25}
                />
              </Link>
            </div>
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

        <div className="h-10 w-10 rounded-full">
          <img
            src="https://gravatar.com/avatar/d6771c28560592154cf60f8bea68d484?s=400&d=retro&r=x"
            alt="user avatar"
            className="h-full w-full rounded-full object-cover"
          />
        </div>

        <div></div>
      </div>
    </aside>
  );
}

export default SideMenu;
