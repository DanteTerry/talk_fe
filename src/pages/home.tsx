import SideMenu from "../components/SideMenu";

function Home() {
  return (
    <div className="h-screen">
      <div className="grid h-full w-full grid-cols-12">
        <div className="col-span-1 px-5 pb-0 pt-5 dark:bg-[#17181B] dark:text-white">
          <div className="flex h-full justify-center">
            <SideMenu />
          </div>
        </div>
        <div className="col-span-2 bg-green-600">options</div>
        <div className="col-span-9 bg-gray-600">options</div>
        {/* <div className="col-span-3 bg-blue-600">options</div> */}
      </div>
    </div>
  );
}

export default Home;
