import { Outlet } from "react-router-dom";
import SideMenu from "../components/SideMenu";
import ChatBar from "../components/ChatBar";
import Chats from "../components/Chats";
import Inputs from "../components/Inputs";

function Home() {
  return (
    <div className="h-screen overflow-hidden dark:bg-[#17181B]">
      <div className="flex h-full">
        <SideMenu />
        <div className="grid h-full w-full grid-cols-12">
          <div className="col-span-3 h-[99.5vh] w-full overflow-hidden border-l-2 border-r-2 py-5 dark:border-gray-700 dark:bg-[#17181B]">
            <Outlet />
          </div>
          <div className="col-span-9 grid grid-rows-12">
            <ChatBar />
            <Chats />
            <Inputs />
          </div>
          {/* <div className="col-span-3 bg-blue-600">options</div */}
        </div>
      </div>
    </div>
  );
}

export default Home;
