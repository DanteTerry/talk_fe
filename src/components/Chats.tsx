import { messages } from "../constants/constants";

function Chats() {
  return (
    <div className="no-scrollbar row-span-9 flex h-[82vh] flex-col gap-1 overflow-y-scroll px-5 py-3 text-white scrollbar-track-white scrollbar-thumb-green-500 dark:scrollbar-track-black">
      {messages.map((message, index: number) =>
        index % 2 === 0 ? (
          <div key={index} className="flex items-center gap-3">
            <div className="h-5!important w-5 self-end rounded-full">
              <img
                src="https://gravatar.com/avatar/d6771c28560592154cf60f8bea68d484?s=400&d=retro&r=x"
                alt="user avatar"
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-1">
              {message.messages.map((msg, index) => (
                <div
                  key={index++}
                  className="bg-white-500 w-max rounded-md bg-black/90 px-3 py-1 text-lg dark:bg-white dark:text-black"
                >
                  <p className="flex gap-2">
                    {msg.message}{" "}
                    <span className="self-end text-xs">{msg.time}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div key={index} className="flex items-center justify-end gap-3">
            <div className="flex flex-col gap-1">
              {message.messages.map((msg) => (
                <div
                  key={index++}
                  className="bg-white-500 w-max rounded-md bg-green-500 px-3 py-1 text-lg"
                >
                  <p className="flex gap-2">
                    {msg.message}{" "}
                    <span className="self-end text-xs">{msg.time}</span>
                  </p>{" "}
                </div>
              ))}
            </div>
            <div className="h-5!important w-5 self-end rounded-full">
              <img
                src="https://gravatar.com/avatar/c1301481bf6cb29ccc22e6244e022c92?s=400&d=retro&r=x"
                alt="user avatar"
                className="h-full w-full rounded-full object-cover"
              />
            </div>
          </div>
        ),
      )}
    </div>
  );
}

export default Chats;
