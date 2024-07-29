import chatGreen from "../assets/chatgreen.png";

function HomeInfo() {
  return (
    <div className="hidden h-full items-center justify-center dark:text-white sm:flex">
      <div className="flex flex-col items-center gap-5">
        <img src={chatGreen} className="w-[250px] sm:w-[300px] lg:w-[400px]" />
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold text-black dark:text-white md:text-3xl lg:text-4xl">
            Welcome to Talk
          </h1>
          <p className="text-sm text-black dark:text-white lg:text-lg">
            Connect Globally, Chat Effortlessly – Your Language, Your World
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomeInfo;
