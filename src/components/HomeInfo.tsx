import chatGreen from "../assets/chatgreen.png";

function HomeInfo() {
  return (
    <div className="flex h-full items-center justify-center dark:text-white">
      <div className="flex flex-col items-center gap-5">
        <img src={chatGreen} className="w-[400px]" />
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-4xl font-bold text-black dark:text-white">
            Welcome to Talk
          </h1>
          <p className="text-lg text-black dark:text-white">
            Connect Globally, Chat Effortlessly – Your Language, Your World
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomeInfo;
